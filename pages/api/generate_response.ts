import type { NextApiRequest, NextApiResponse } from 'next'

// Request:
//   message: what the user send through SMS to us
//   phone: the phone number that the user use to send us the SMS

import axios from "axios";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const openAIUrl = 'https://api.openai.com/v1/chat/completions';
  const prompt = 'Translate the following English text to French: "{}"';
  const maxTokens = 60;

  let gpt3Response;
  try {
    gpt3Response = await axios.post(openAIUrl, {
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: "Say this is a test!"
      }],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calling OpenAI API' });
    return;
  }

  res.status(200).json({ OpenAIResponse: gpt3Response.data.choices[0].message.content});
}