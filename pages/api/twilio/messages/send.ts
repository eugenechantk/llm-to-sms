


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
        try {
            const history = new AccessRedis().get(From)
        } catch (error) {
            console.error('Unable to retrieve history');
        }
        // Pass query to Model  
        try {
            const data = await MODEL({ query: Body, history })
            await client.messages
                .create({
                    body: `Sending message back to you: ${Body}`,
                    from: To,
                    to: From,
                })
        }
        catch (err) {
            console.error("Unable to send message");
        }
        // Store new message
        try {
            const store = new AccessRedis().update({ number: From, messages: history || JSON.stringify({}) })
        }
        catch (err) {
            console.log('Unable to store outpout message');
        }
        res.status(200).json({ status: 'success' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}


