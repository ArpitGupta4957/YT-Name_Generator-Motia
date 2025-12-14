import {EventConfig} from "motia";

//step 5: sends te formatted email with improved titles using resend
export const config: EventConfig = {
    name: "SendEmail",
    type: "event",
    subscribes: ["yt.titles.generated"], // consume titles from AI step
    emits: ["yt.email.send"],
}

interface ImprovedTitle{
    original: string;
    improved: string;
    rational: string;
    url: string;
}

// Helper: formats improved titles into a plain-text email body
function generateEmailText(channelName: string, titles: ImprovedTitle[]): string {
    let text = `YouTube Title Doctor - Improved Titles for ${channelName}\n`;
    text += `${'='.repeat(60)}\n\n`;

    titles.forEach((title, index) => {
        text += `Video ${index + 1}:\n`;
        text += `------------------------------\n`;
        text += `Original: ${title.original}\n`;
        text += `Improved: ${title.improved}\n`;
        text += `Why: ${title.rational}\n`;
        text += `Watch: ${title.url}\n\n`;
    });

    text += `Powered by Motia.dev\n`;

    return text;
}

export const handler = async (eventData: any, {emit, logger, state}: any) => {
    let jobId: string | undefined;

    try{
        const data = eventData || {};
        jobId = data.jobId;
        const email = data.email;
        const channelName = data.channelName;
        const improvedTitles = data.improvedTitles;

        logger.info('Sending email', {jobId, email, titleCount: improvedTitles.length});
        const Resend_Api_Key = process.env.RESEND_API_KEY;
        const Resend_From_Email = process.env.RESEND_FROM_EMAIL;
        if(!Resend_Api_Key){
            throw new Error("RESEND_API_KEY is not configured");
        }
        if(!Resend_From_Email){
            throw new Error("RESEND_FROM_EMAIL is not configured");
        }

        const jobData = await state.get('submissions', jobId);
        await state.set('submissions', jobId, {
            ...jobData,
            status: "sending email",
        });

        const emailText = generateEmailText(channelName, improvedTitles); 
        const response = await fetch('https://api.resend.com/emails', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${Resend_Api_Key}`,
            },
            body: JSON.stringify({
                from: Resend_From_Email,
                to: [email],
                subject: `Improved YouTube Titles for ${channelName}`,
                text: emailText,
            }),
        });

        if(!response.ok){
            const status = response.status;
            const errorText = await response.text();
            let errorMessage = "Unknown Email error";
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error?.message || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            logger.error('Resend API request failed', { status, errorText });
            throw new Error(`Resend API error (${status}): ${errorMessage}`);
        }
        const emailResponse = await response.json();
        logger.info('Email sent successfully', {jobId, emailId: emailResponse.id,});
    
        await state.set('submissions', jobId, {
            ...jobData,
            status: "completed",
            emailId: emailResponse.id,
            completedAt: new Date().toISOString(),
        });

        await emit({
            topic: "yt.email.send",
            data: {
                jobId,
                email,
                emailId: emailResponse.id
            },
        });
    }
    catch(error: any){
        logger.error('Error sending email :', {error: error.message});

        if(!jobId){
            logger.error("Missing jobId cant send email");
            return;
        }

        const jobData = await state.get('submissions', jobId);
        await state.set('submissions', jobId, {
            ...jobData,
            status: "resolve_failed",
            updatedAt: new Date().toISOString(),
            error: error.message
        });

    }
}