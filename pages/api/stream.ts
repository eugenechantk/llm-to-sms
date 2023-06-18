// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = 'https://api.openai.com/v1/chat/completions';
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
        content: `come up with 5 different conversational questions to ask`
      },
      {
        role: "assistant",
        content: `What has been the most interesting thing you've learned or discovered recently?
        If you could have a conversation with any historical figure, who would it be and why?
        What is your favorite way to unwind and relax after a long day?
        If you could visit any place in the world right now, where would you go and what would you do there?
        What is one goal or aspiration you have for yourself in the next year, and what steps are you taking to achieve it?`
      },
      {
        role: "user",
        content: `If you could have a conversation with any historical figure, who would it be and why?  Be as detailed as possible, and help me come up with something unique`
      },
      {
        role: "assistant",
        content: `If I could have a conversation with any historical figure, I would choose Leonardo da Vinci, the renowned Italian polymath of the Renaissance era. Leonardo da Vinci is widely regarded as one of the most brilliant minds in human history, excelling in various fields such as art, science, engineering, and philosophy. His curiosity, creativity, and multidisciplinary approach to knowledge make him a captivating choice for a conversation.

        During our meeting, I would be enthralled to discuss da Vinci's artistic techniques, particularly his mastery of painting and his innovative use of perspective. I would love to delve into the intricacies of his most famous works, such as the Mona Lisa and The Last Supper, gaining insights into his thought processes, the symbolism he incorporated, and the stories behind each piece.
        
        Furthermore, I would be eager to explore da Vinci's scientific and engineering genius. His groundbreaking observations and discoveries in fields such as anatomy, astronomy, and mechanics were far ahead of his time. I would ask him about his studies of human anatomy, his innovative designs for machines and inventions, and his visionary ideas about flight and engineering. His notebooks, filled with detailed sketches and observations, provide a wealth of knowledge to explore and understand.
        
        In addition to his artistic and scientific endeavors, I would be intrigued to learn about da Vinci's philosophies and worldview. His observations on the interconnectedness of nature, his pursuit of knowledge as a means of understanding the universe, and his fascination with the human mind and spirit offer endless avenues for thought-provoking discussions.
        
        Ultimately, conversing with Leonardo da Vinci would provide an extraordinary opportunity to gain insights into the mind of a true Renaissance genius. By exploring his art, science, and philosophy, I would hope to unravel the complexities of his creative process, uncover hidden depths within his works, and gain a deeper understanding of the world through his visionary perspective.`
      },
      {
        role:'user',
        content:`who is another figure other than leonardo da vinci`
      }
    ],
    temperature: 1.0,
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
