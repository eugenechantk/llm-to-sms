


import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import { AccessRedis } from '@/pages/api/history/functions'
import MODEL from '@/pages/api/1'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    try {
        const client = new Twilio(accountSid, authToken);
        const { Body, From, To } = req.body;
        // Retrieve user chat history from Redis
        const history = new AccessRedis().get(From)

        // Pass query to Model  
        const data = await MODEL({ query: Body, history })

        await client.messages
            .create({
                body: `Sending message back to you: ${Body}`,
                from: To,
                to: From,
            })

        // Store new message
        const store = new AccessRedis().update({ number: From, messages: history || JSON.stringify({}) })
        res.status(200).json({ status: 'success' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}


