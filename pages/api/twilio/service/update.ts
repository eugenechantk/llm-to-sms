


import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    try {
        const client = new Twilio(accountSid, authToken);
        const { statusCallback, serviceName, inboundRequestUrl, fallbackUrl } = req.body;
        await client.messaging.v1.services
            .create({
                statusCallback,
                friendlyName: serviceName,
                inboundRequestUrl,
                inboundMethod: 'POST',
                fallbackUrl,
                fallbackMethod: 'POST',
                useInboundWebhookOnNumber: true,
            })
        res.status(200).json({ status: 'success' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}


