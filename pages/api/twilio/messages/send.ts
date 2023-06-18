
import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from "twilio";
import { AccessRedis } from '@/pages/api/history/functions'
import { Redis } from '@upstash/redis'

const db_url = 'https://massive-ostrich-38534.upstash.io';
const redis = new Redis({
    url: db_url,
    token: 'AZaGACQgNWFhNTk4YWUtZGI1NC00ZTRmLTg4NjktMDg1MDhhZGM4OGQyYzRiNWI1ZDhhNWY1NGViYTk0NDVkYTJhODJlNWJkOTY=',
})

const baseUrl = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    console.log(accountSid, authToken)
    try {
        const redisStore = new AccessRedis()
        const client = new Twilio(accountSid, authToken);
        const { Body, From, To } = req.body;
        console.log(Body, From, To)
        let history: any;
        // Retrieve user chat history from Redis
        try {

            history = await redis.get(From)
            console.log('what redis got: ', history);

        } catch (error) {
            console.error('Unable to retrieve history');
        }
        // Pass query to Model  
        try {
            // TODO: calls the /api/stream route (wrap it as a function)
            // Request body needs: history -> in the type of ChatCompleteRequestMessage, accountSid, authToken, To, From
            const body = {
                to: To,
                from: From,
                history: 'something'
            }
            const options = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
              };

            await fetch(`${baseUrl}/api/stream`, options).then((response) => console.log(response))
            // await client.messages
            //     .create({
            //         body: `v3 response: something ${Body}`,
            //         from: To,
            //         to: From,
            //     })
            const updatedHistory = history + ", " + Body
            await redis.set(From, updatedHistory)
        }
        catch (err) {
            console.log(err)
            // console.error("Unable to send message");
        }
        // TODO: Store new message
        
        res.status(200).json({ status: 'success' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}


