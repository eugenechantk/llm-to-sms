import { NextApiRequest, NextApiResponse } from "next";
import { Twilio } from "twilio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new Twilio(accountSid, authToken);

  const { chunk, to, from } = req.body;
  console.log(chunk, to, from)

  await client.messages
    .create({
      body: `${chunk}`,
      from: to,
      to: from,
    })
    .then(() => {
      res.status(200).send({ message: `sent chunk to ${from}: ${chunk}` });
    });
}
