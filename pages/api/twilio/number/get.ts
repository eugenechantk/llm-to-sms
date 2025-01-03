
import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const client = new Twilio(accountSid, authToken);
        let local = await client.availablePhoneNumbers('US')
            .local
            .list({ areaCode: 510, limit: 20 })
        res.status(200).json({ number: local[0].phoneNumber, status: 'success', data: local[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}