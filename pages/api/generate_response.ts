import type { NextApiRequest, NextApiResponse } from 'next'

// Request:
//   message: what the user send through SMS to us
//   phone: the phone number that the user use to send us the SMS

import axios from "axios";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const openAIUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  const prompt = 'Translate the following English text to French: "{}"';
  const maxTokens = 60;

  let gpt3Response;
  try {
    gpt3Response = await axios.post(openAIUrl, {
      prompt: prompt,
      max_tokens: maxTokens,
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

  res.status(200).json({ OpenAIResponse: gpt3Response.data.choices[0].text.trim() });
}

//create a dictionary with phone number, string "GPT Says:", "User says"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Call the open ai api route


  // Send back the response of the open ai
  res.status(200).json({ OpenAIResponse: 'John Doe' })
}
