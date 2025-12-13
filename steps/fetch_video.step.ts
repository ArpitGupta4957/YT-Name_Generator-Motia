import {EventConfig} from "motia";

//step 3: define the config for the API route
//retrieve the latest filed video names using yt data API
export const config: EventConfig = {
    name: "FetchVideos",
    type: "event",
    subscribes: ["yt.channel.resolved"],
    emits: ["yt.videos.fetched", "yt.videos.failed"],
}

interface Video{
    videoId: string;
    title: string;
    url: string;
    publishedAt: string;
    thumbnail: string;
}

export const handler = async (eventData: any, {emit, logger, state}: any) => {
    let jobId: String | undefined
    let email: String | undefined
    
    try{
        const data = eventData || {};
        jobId = data.jobId;
        const channelId = data.channelId;
        email = data.email;
        const channelName = data.channelName;

        logger.info('Processing FetchVideos event', {jobId, channelId});
        const yt_api_key = process.env.YOUTUBE_API_KEY;
        if(!yt_api_key){
            throw new Error("YT_API_KEY is not configured");
        }

        const jobData = await state.get(`job_${jobId}`);
        await state.set(`job_${jobId}`, {
            ...jobData,
            status: "fetching videos",
        });

        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=5&key=${yt_api_key}`;
        const response = await fetch(searchUrl);
        const youtubeData = await response.json();

        if(!youtubeData.items || youtubeData.items.length === 0){
            logger.warn("No videos found for channel", {channelId});

            await state.set(`job_${jobId}`, {
                ...jobData,
                status: "no_videos_found",
                updatedAt: new Date().toISOString(),
                error: "No videos found for the specified channel"
            });
            await emit({
                topic: "yt.videos.failed",
                data: {
                    jobId,
                    email,
                    error: "No videos found for the specified channel"
                }
            });
            return;
        }

        const videos: Video[] = youtubeData.items.map((item: any) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            publishedAt: item.snippet.publishedAt
        }));
        logger.info("Fetched videos successfully", {jobId, videoCount: videos.length});

        await state.set(`job_${jobId}`, {
                ...jobData,
                status: "sucessfully_fetched",
                updatedAt: new Date().toISOString(),
        });
        await emit({
            topic: "yt.videos.fetched",
            data: {
                    jobId,
                    channelName,
                    videos,
                    email,
            }
        });
    }
    catch(error: any){
        logger.error('Error fetching videos :', {error: error.message});

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
            topic: "yt.video.failed",
            data: {
                jobId,
                email,
                error: error.message
            } 
        })
    }
}