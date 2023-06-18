


import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import { AccessRedis } from '@/pages/api/history/functions'
import MODEL from '@/pages/api/1'
import { Redis } from '@upstash/redis'

const db_url = 'https://massive-ostrich-38534.upstash.io';
const redis = new Redis({
    url: db_url,
    token: 'AZaGACQgNWFhNTk4YWUtZGI1NC00ZTRmLTg4NjktMDg1MDhhZGM4OGQyYzRiNWI1ZDhhNWY1NGViYTk0NDVkYTJhODJlNWJkOTY=',
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    try {
        const redisStore = new AccessRedis()
        const client = new Twilio(accountSid, authToken);
        const { Body, From, To } = req.body;
        let history: any;
        // Retrieve user chat history from Redis
        try {

            history = await redis.get(From)
            console.log(history);

        } catch (error) {
            console.error('Unable to retrieve history');
        }
        // Pass query to Model  
        try {
            // const data = await MODEL(Body, '', '', '', history)
            await client.messages
                .create({
                    body: `v3 response: something ${Body}`,
                    from: To,
                    to: From,
                })
        }
        catch (err) {
            console.error("Unable to send message");
        }
        // Store new message
        try {
            // console.log('Saving' + number)
            // let next_history: string[] = [];
            // let past_history: any = await redis.get(number);

            // var messages = JSON.parse(messages);

            // if (past_history !== null) {
            //     next_history = past_history.concat(messages);
            // }
            // else {
            //     next_history = messages;
            // }
            await redis.set(From, 'something')
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


