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
    rational: string;
    url: string;
}

interface Video{
    videoId: string;
    title: string;
    url: string;
    publishedAt: string;
    thumbnail: string;
}

export const handler = async (eventData: any, {emit, logger, state}: any) => {
    let jobId: string | undefined
    let email: string | undefined

    try{
        const data = eventData || {};
        jobId = data.jobId;
        email = data.email;
        const channelName = data.channelName;
        const videos = data.videos;

        logger.info('Processing FetchVideos event', {jobId, videoCount: videos.length});
        const gemini_Api_Key = process.env.GEMINI_API_KEY;
        if(!gemini_Api_Key){
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const jobData = await state.get('submissions', jobId);
        await state.set('submissions', jobId, {
            ...jobData,
            status: "generating titles for videos",
        });

        const videoTitles = videos.map((v: Video, idx: number) => `${idx + 1}. "${v.title}"`).join('\n');
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
                "rational": "..."
                    },
                ]
                }`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${gemini_Api_Key}`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    responseMimeType: 'application/json',
                },
            }),
        });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${errorData.error?.message} || "Unknown error"`);
        }
        const aiResponse = await response.json();
        const aiContent = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        const cleanedContent = aiContent
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();
        const parsedContent = JSON.parse(cleanedContent);
        const improvedTitles: ImprovedTitle[] = parsedContent.titles.map((title: any, idx: number) => ({
            original: title.original,
            improved: title.improved,
            rational: title.rational,
            url: videos[idx].url,
        }));
        logger.info("Generated improved titles successfully", {jobId, improvedCount: improvedTitles.length});
        await state.set('submissions', jobId, {
            ...jobData,
            status: "titles_generated",
            improvedTitles
        });

        await emit({
            topic: "yt.titles.generated",
            data: {
                jobId,
                channelName,
                improvedTitles,
                email,
            },
        });
    }
    catch(error: any){
        logger.error('Error generating titles :', {error: error.message});

        if(!jobId || !email){
            logger.error("Missing jobId or email in error handling");
            return;
        }

        const jobData = await state.get('submissions', jobId);
        await state.set('submissions', jobId, {
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