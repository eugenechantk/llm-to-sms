import { NextApiRequest, NextApiResponse } from "next";
import { Twilio } from "twilio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new Twilio(accountSid, authToken);

  const body = req.body;

  const { to, from, chunk } = body;
  console.log(to, from, chunk); 
  // console.log('what i got from /api/twilio/messages/send_chunk', to, from , chunk)

  await client.messages
    .create({
      body: `${chunk}`,
      from: to,
      to: from,
    })
    .then(() => {
      console.log({ message: `sent chunk to ${from}: ${chunk}` });
      Promise.resolve
      
    });
  res.end()
}
