import {EventConfig} from "motia";

//step 5: sends te formatted email with improved titles using resend
export const config: EventConfig = {
    name: "SendEmail",
    type: "event",
    subscribes: ["yt.videos.failed", "yt.titles.failed", "yt.channel.failed"],
    emits: ["yt.error.notified"],
}



export const handler = async (eventData: any, {emit, logger, state}: any) => {

    try{
        const data = eventData || {};
        const jobId = data.jobId;
        const email = data.email;
        const error = data.error;

        logger.info('Handling Error event', {jobId, email});

        const Resend_Api_Key = process.env.RESEND_API_KEY;
        const Resend_From_Email = process.env.RESEND_FROM_EMAIL;
        if(!Resend_Api_Key){
            throw new Error("RESEND_API_KEY is not configured");
        }

        const jobData = await state.get('submissions', jobId);
        await state.set('submissions', jobId, {
            ...jobData,
            status: "sending email",
        });

        const emailText = `we are facing some issues in generating better titles for your channel`; 
        const response = await fetch('https://api.resend.com/emails', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${Resend_Api_Key}`,
            },
            body: JSON.stringify({
                from: Resend_From_Email,
                to: [email],
                subject: `Error Notification`,
                text: emailText,
            }),
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(`Resend API error: ${errorData.error?.message} || "Unknown Email error"`);
        }
        const emailResponse = await response.json();

        await emit({
            topic: "yt.error.notified",
            data: {
                jobId,
                email,
                emailId: emailResponse.id
            },
        });
    }
    catch(error: any){
        logger.error('Failed to send error notification');
    }
}