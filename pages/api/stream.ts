// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = "https://api.openai.com/v1/chat/completions";
  const apiKey = process.env.OPENAI_KEY; // Replace with your actual API key
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const body = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content:
          "Count to 100, with a comma between each number and no newlines. E.g., 1, 2, etc",
      },
    ],
    stream: true,
  };
  const controller = new AbortController();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    // Use the AbortController's signal to allow aborting the request
    // This is a `fetch()` API thing, not an OpenAI thing
    signal: controller.signal,
  }).then(async (response) => {
    const reader = response.body!.getReader();
    reader.read().then(function processText({ done, value }): Promise<void> {
      if (done) {
        console.log("stream complete");
        res.status(200).send({ message: "stream done" });
      }
      const decoded = new TextDecoder().decode(value);
      // console.log(value);
      const json = decoded.split("data: ")[1]; // this data needs some manipulation in order to be parsed, a separate concern
      const aiResponse = JSON.parse(json);
      const aiResponseText = aiResponse.choices[0].delta?.content;
      console.log(aiResponseText)

      return reader.read().then(processText);
    });
  });
  res.status(200).send({ message: "stream done" });
}
