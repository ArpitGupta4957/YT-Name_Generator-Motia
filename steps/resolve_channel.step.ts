import {EventConfig} from "motia";

//step 1: define the config for the API route
//convert youtube handel/name to channel ID using yt data API
export const config: EventConfig = {
    name: "ResolveChannel",
    type: "event",
    subscribes: ["yt.submit"],
    emits: ["yt.channel.resolved", "yt.channel.resolve.failed"],
}

export const handler = async (eventData: any, {emit, logger, state}: any) => {
    let jobId: String | undefined
    let email: String | undefined

    try{
        const data = eventData || {};
        jobId = data.jobId;
        const channelInput = data.channel;
        email = data.email;

        logger.info('Processing ResolveChannel event', {jobId, channelInput});
        const yt_api_key = process.env.YOUTUBE_API_KEY;
        if(!yt_api_key){
            throw new Error("YT_API_KEY is not configured");
        }

        const jobData = await state.get(`job_${jobId}`);
        await state.set(`job_${jobId}`, {
            ...jobData,
            status: "resolving",
        });

        let channelId: string | null = null;
        let channelName: string | null = null;

        if(channelInput.startsWith('@')){
            const handel = channelInput.substring(1);
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handel)}&key=${yt_api_key}`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();

            if(searchData.items && searchData.items.length > 0){
                channelId = searchData.items[0].snippet.channelId;
                channelName = searchData.items[0].snippet.channelTitle;
            }
        } else {
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelInput)}&key=${yt_api_key}`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();

            if(searchData.items && searchData.items.length > 0){
                channelId = searchData.items[0].id.channelId;
                channelName = searchData.items[0].snippet.channelTitle;
            }
        }

        if(!channelId){
            logger.error("Failed to resolve channel ID", {channelInput});
            await state.set(`job_${jobId}`, {
                ...jobData,
                status: "failed",
                error: "Failed to resolve channel ID"
            });
            await emit({
            topic: "yt.channel.resolved.failed",
            data: {
                jobId,
                email,
            }
        });
            return;
        }
        await emit({
            topic: "yt.channel.resolved",
            data: {
                jobId,
                email,
            }
        });
        return;     
    }
    catch(error: any){
        logger.error('Error processing ResolveChannel event:', {error: error.message});
        if(!jobId || !email){
            logger.warn("Missing jobId or email in error handling", {jobId, email});
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
            topic: "yt.channel.resolve.failed",
            data: {
                jobId,
                email,
                error: error.message
            } 
        })
    }
}