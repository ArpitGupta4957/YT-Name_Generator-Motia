import type { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: ApiRouteConfig = {
  name: 'submitChannel',
  method: 'POST',
  path: '/submit',
  type: 'api',
  emits: ['yt.submit'],
  bodySchema: z.object({
    channel: z.string().min(1, 'Channel is required'),
    email: z.string().email('Invalid email format'),
  }),

  responseSchema: {
    202: z.object({
      success: z.boolean(),
      jobId: z.string(),
      message: z.string(),
    }),
    400: z.object({
      error: z.string(),
    }),
    500: z.object({
      error: z.string(),
    }),
  },
}

export const handler: Handlers['submitChannel'] = async (req, { emit, logger, state }) => {
  try {
    logger.info('Received submitChannel request', { body: req.body })
    
    const { channel, email } = req.body

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    await state.set('submissions', jobId, {
      jobId,
      channel,
      email,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    })
    
    logger.info('Stored submission in state', { jobId, channel, email })

    // Line 40 FIX: Include channel and email in emit
    await emit({
      topic: 'yt.submit',
      data: { jobId, channel, email },
    })

    // Line 53 FIX: Return matches responseSchema
    return {
      status: 202,
      body: {
        success: true,
        jobId,
        message: 'Submission successful. You will soon receive an email with improved youtube names',
      },
    }
  } catch (error: any) {
    logger.error('Error in submitChannel handler:', { error: error.message })
    return {
      status: 500,
      body: { error: 'Internal Server Error' },
    }
  }
}