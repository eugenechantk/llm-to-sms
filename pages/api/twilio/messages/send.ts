


import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

import MODEL from '@/pages/api/llm/test/1'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    try {
        const client = new Twilio(accountSid, authToken);
        const { Body, From, To } = req.body;

        // Pass query to Model  
        const data = await MODEL(Body)

        await client.messages
            .create({
                body: `Sending message back to you: ${Body}`,
                from: To,
                to: From,
            })
        res.status(200).json({ status: 'success' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}


