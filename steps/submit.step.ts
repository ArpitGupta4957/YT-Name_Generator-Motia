import {ApiRouteConfig} from "motia";

//step 1: define the config for the API route
export const config: ApiRouteConfig = {
    name: "submitChannel",
    method: "POST",
    path: "/submit",
    type: "api",
    emits: ["yt.submit"],
}

interface SubmitRequestBody {
    channel: string;
    email: string;
}

//step 2: implement the API route handler
export const handler = async (req: any, {emit, logger, state}: any) => {
    try{
        logger.info("Received submitChannel request", {body: req.body});
        const {channel, email} = req.body as SubmitRequestBody;
        if(!channel || !email){
            logger.warn("Invalid request body", {body: req.body});
            return {
                status: 400,
                body: {message: "Invalid request body"}
            };
        }

        // validate
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            logger.warn("Invalid email format", {email});
            return {
                status: 400,
                body: {message: "Invalid email format"}
            };
        }

        // Store in state (assuming state has a method to set data)
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        await state.set(`job_${jobId}`,{
            jobId,
            channel,
            email,
            status: "submitted",
            createdAt: new Date().toISOString()
        });
        logger.info("Stored submission in state", {jobId, channel, email});

        // Emit event for further processing
        await emit("yt.submit", {jobId, channel, email});
        return {
            status: 202,
            body: {message: "Submission successful. You will soon receive an email with improved youtube names", jobId}
        };

    }
    catch(error: any){
        logger.error("Error in submitChannel handler:", {error: error.message});
        return {
            status: 500,
            body: {message: "Internal Server Error"}
        };
    }
}