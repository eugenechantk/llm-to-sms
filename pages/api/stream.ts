// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL
  : "http://localhost:3000";
const sampleMessages = [
  {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: `come up with 5 different conversational questions to ask`,
  },
  {
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: `What has been the most interesting thing you've learned or discovered recently?
    If you could have a conversation with any historical figure, who would it be and why?
    What is your favorite way to unwind and relax after a long day?
    If you could visit any place in the world right now, where would you go and what would you do there?
    What is one goal or aspiration you have for yourself in the next year, and what steps are you taking to achieve it?`,
  },
  {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: `If you could have a conversation with any historical figure, who would it be and why?  Be as detailed as possible, and help me come up with something unique`,
  },
  {
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: `If I could have a conversation with any historical figure, I would choose Leonardo da Vinci, the renowned Italian polymath of the Renaissance era. Leonardo da Vinci is widely regarded as one of the most brilliant minds in human history, excelling in various fields such as art, science, engineering, and philosophy. His curiosity, creativity, and multidisciplinary approach to knowledge make him a captivating choice for a conversation.

    During our meeting, I would be enthralled to discuss da Vinci's artistic techniques, particularly his mastery of painting and his innovative use of perspective. I would love to delve into the intricacies of his most famous works, such as the Mona Lisa and The Last Supper, gaining insights into his thought processes, the symbolism he incorporated, and the stories behind each piece.
    
    Furthermore, I would be eager to explore da Vinci's scientific and engineering genius. His groundbreaking observations and discoveries in fields such as anatomy, astronomy, and mechanics were far ahead of his time. I would ask him about his studies of human anatomy, his innovative designs for machines and inventions, and his visionary ideas about flight and engineering. His notebooks, filled with detailed sketches and observations, provide a wealth of knowledge to explore and understand.
    
    In addition to his artistic and scientific endeavors, I would be intrigued to learn about da Vinci's philosophies and worldview. His observations on the interconnectedness of nature, his pursuit of knowledge as a means of understanding the universe, and his fascination with the human mind and spirit offer endless avenues for thought-provoking discussions.
    
    Ultimately, conversing with Leonardo da Vinci would provide an extraordinary opportunity to gain insights into the mind of a true Renaissance genius. By exploring his art, science, and philosophy, I would hope to unravel the complexities of his creative process, uncover hidden depths within his works, and gain a deeper understanding of the world through his visionary perspective.`,
  },
  {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: `who is another figure other than leonardo da vinci`,
  },
];

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(config);

const redis = new Redis({
  url: process.env.HISTORY_REDIS_URL!,
  token: process.env.HISTORY_REDIS_TOKEN!,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export default async function handler(req: NextRequest, res: NextApiResponse) {
  const json = await req.json();
  console.log(json, typeof json);
  const { to, from, prompt } = json;

  let cacheRes = "";
  let msgList: string[] = [];

  // GET CHAT HISTORY
  const history = await redis.lrange(from, -6, -1);
  console.log(history)

  const convertedArray:ChatCompletionRequestMessage[] = history.map((item) => {
    const [role, content] = item.split(':');
    const roleFormatted = role.trim()
    return {
      role: roleFormatted === "user" ? ChatCompletionRequestMessageRoleEnum.User : ChatCompletionRequestMessageRoleEnum.Assistant,
      content: content.trim()
    };
  });

  console.log(convertedArray)

  // const formattedMsg = [{
  //   role: ChatCompletionRequestMessageRoleEnum.User,
  //   content: prompt,
  // },]


  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: convertedArray,
    // messages: formattedMsg,
  });


  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onStart: async () => {
      console.log("Streaming starts");
      Promise.resolve();
    },
    onToken: async (token: string) => {
      cacheRes += token;
      if (cacheRes.length > 160) {
        cacheRes = cacheRes.replace(/\r?\n/g, "");
        cacheRes = cacheRes.replace(/\\/g, "");
        const words = cacheRes.split(" ");
        const lastWord = words.pop() || "";
        const updatedCacheRes = words.join(" ");
        console.log(updatedCacheRes);
        console.log(
          `number to send to ${from} and chunk is ${updatedCacheRes}`
        );

        // SEND TO API ROUTE TO HANDLE SMS SENDING BACK TO USER
        const body = {
          to: to,
          from: from,
          chunk: updatedCacheRes,
        };
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };
        try {
          await fetch(`${baseUrl}/api/twilio/messages/send_chunk`, options);
        } catch (e) {
          console.log(e);
        }

        cacheRes = lastWord;
      }
    },
    onCompletion: async (completion: string) => {
      const formattedResponse = "assistant: " + completion;
      const result = await redis.rpush(from, formattedResponse)
      console.log(cacheRes);
      // SEND TO API ROUTE TO HANDLE SMS SENDING BACK TO USER
      const body = {
        to: to,
        from: from,
        chunk: cacheRes,
        // chunk: completion,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      try {
        await fetch(`${baseUrl}/api/twilio/messages/send_chunk`, options).then(
          () => {
            console.log("Streaming done");
            // console.log(msgList)
            // @ts-ignore
            res.status(200).json({ response: completion });
            res.end()
            // Promise.resolve();
          }
        );
      } catch (e) {
        console.log(e);
        res.status(400).json({ error: 'something wrong' });
        res.end()
        // Promise.resolve()
      }
    },
  });

  return new StreamingTextResponse(stream);
}
