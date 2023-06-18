


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
        const { serviceName, friendlyName, inboundRequestUrl, fallbackUrl } = req.body;
        let updateService = await client.messaging.v1.services(serviceName)
            .update({
                friendlyName: friendlyName,
                inboundRequestUrl,
                inboundMethod: 'POST',
                fallbackUrl,
                fallbackMethod: 'POST',
                usecase: 'notifications'
            })
        res.status(200).json({ status: 'success', service: updateService })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}


