import type { NextApiRequest, NextApiResponse } from "next";
import { Twilio } from "twilio";
import { AccessRedis } from "@/pages/api/history/functions";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.HISTORY_REDIS_URL!,
    token: process.env.HISTORY_REDIS_TOKEN!,
});

const baseUrl = process.env.VERCEL_URL
    ? "https://" + process.env.VERCEL_URL
    : "http://localhost:3000";

// interface ISendRouteRequest extends NextApiRequest {
//     body: {
//         From: string,
//         To: string,
//         Body: string
//     }
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    if (req.method !== "POST") {
        res.status(405);
        return;
    }
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    console.log(accountSid, authToken);

    try {
        const redisStore = new AccessRedis();
        const client = new Twilio(accountSid, authToken);

        const body = req.body;
        const { Body, From, To } = body;
        console.log(Body, From, To);

        // Store user prompt to redis list
        const formattedPrompt = "user: " + Body;
        const result = await redis.rpush(From, formattedPrompt);

        try {
            // history = await redis.get(From)
            console.log("what redis got: ", history);
        } catch (error) {
            console.error("Unable to retrieve history");
        }
        // Pass query to Model
        try {
            const body = {
                to: To,
                from: From,
                prompt: Body,
            };
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            };
            await fetch(`${baseUrl}/api/stream`, options).then((response) =>
                console.log("all stream sent")
            );
            res.status(200)
        } catch (err) {
            console.log(err);
            res.status(500)
        }

    } catch (error) {
        console.log(error);
    }
}
