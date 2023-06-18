


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
        const { phoneNumber } = req.body;
        const data = await client.incomingPhoneNumbers
            .create({
                phoneNumber
            })
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}


