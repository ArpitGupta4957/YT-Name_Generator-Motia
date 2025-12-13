import {EventConfig} from "motia";

//step 4: openai title generation by GPT-4
export const config: EventConfig = {
    name: "generateTitles",
    type: "event",
    subscribes: ["yt.videos.fetched"],
    emits: ["yt.titles.generated", "yt.titles.failed"],
}

interface ImprovedTitle{
    original: string;
    improved: string;
    rationale: string;
    url: string;
}

export const handler = async (eventData: any, {emit, logger, state}: any) => {
    let jobId: String | undefined
    let email: String | undefined

    try{
        const data = eventData || {};
        jobId = data.jobId;
        email = data.email;
        const channelName = data.channelName;
        const videos = data.videos;

        logger.info('Processing FetchVideos event', {jobId, videoCount: videos.length});
        const openAi_Api_Key = process.env.OPENAI_API_KEY;
        if(!openAi_Api_Key){
            throw new Error("OPENAI_API_KEY is not configured");
        }

        const jobData = await state.get(`job_${jobId}`);
        await state.set(`job_${jobId}`, {
            ...jobData,
            status: "generating titles for videos",
        });

        const videoTitles = videos.items.map((v: any, idx: number) => `${idx + 1}. "${v.title}"`).join('\n');
        const prompt = `You are a YouTube title optimization expert. Below are ${videos.length} video titles from the channel "${channelName}".
                For each title, provide:
                1. An improved version that is more engaging,
                SEO-friendly, and likely to get more clicks
                2. A brief rationale (1-2 sentences) explaining why the improved title is better.
                Guidelines :
                - Keep the core topic and authenticity
                - Use action verbs, numbers, and specific value
                propositions
                - Make it curiosity-inducing without being clickbait
                - Optimize for searchability and clarity
                Video Titles:${videoTitles}

                Respond in JSON format:{

                "titles": [
                    {
                "original": "..",
                "improved": "...",
                "rationale": "..."
                    },
                ]
                }`;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions"', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${openAi_Api_Key}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: "You are a youtube SEO and engagement expert who helps creators write better video titles." },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                response_format: {type: 'json_object'},
            }),
        });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message} || "Unknown error"`);
        }
        const aiResponse = await response.json();
        const aiContent = aiResponse.choices[0].message.content;
        const parsedContent = JSON.parse(aiContent);
        const improvedTitles: ImprovedTitle[] = parsedContent.titles.map((title: any, idx: number) => ({
            original: title.original,
            improved: title.improved,
            rationale: title.rationale,
            url: videos[idx].url,
        }));
        logger.info("Generated improved titles successfully", {jobId, improvedCount: improvedTitles.length});
        await state.set(`job_${jobId}`, {
            ...jobData,
            status: "titles_generated",
            improvedTitles
        });

        await emit({
            topic: "yt.titles.failed",
            data: {
                jobId,
                channelName,
                improvedTitles,
                email,
            },
        });
    }
    catch(error: any){
        logger.error('Error generating videos :', {error: error.message});

        if(!jobId || !email){
            logger.error("Missing jobId or email in error handling");
            return;
        }

        const jobData = await state.get(`job_${jobId}`);
        await state.set(`job_${jobId}`, {
            ...jobData,
            status: "resolve_failed",
            updatedAt: new Date().toISOString(),
            error: error.message
        });

        await emit({
            topic: "yt.titles.failed",
            data: {
                jobId,
                email,
                error: error.message
            } 
        })
    }
}