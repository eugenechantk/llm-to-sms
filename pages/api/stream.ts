// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

// const sampleHistory = `
// This is the chat history: 
// User: What is affirmative action?
// Agent: Affirmative action refers to policies or programs aimed at increasing the representation and opportunities for historically underrepresented groups in areas such as employment, education, or business. These policies are designed to address past and present discrimination and promote equal opportunities formarginalized groups, typically based on race, gender, religion, or ethnicity. Affirmative action measures can include preferential hiring or admissions practices, outreach programs, or the establishment of diversity quotas. The purpose of affirmative action is to promote diversity, inclusion, and equal access to opportunities in order to create a more equitable society.
// User: How does it help minorities
// Agent: Affirmative action is intended to help minorities by addressing systemic barriers and promoting equal opportunities. By implementing measures such as preferential treatment in hiring or admissions processes, targeted recruitment efforts, or diversity quotas, the goal is to counteract historic and ongoing discrimination faced by minority groups. Affirmative action can benefit minorities in several ways:1. Increased representation: Affirmative action seeks toensure that historically underrepresented groups have a fair chance to be represented in various sectors, including education, employment, and politics. This promotes diversity and inclusion, giving minorities a greater voice and presence in areas where they may have been historically marginalized.2. Equal access to opportunities: Affirmative action aims to provide minorities with the same opportunities as those enjoyed by dominant groups. It promotes fair treatment and equal consideration in admission processes, hiring decisions, and other avenues for advancement. This can help level the playing field and reduce the effects of systemic discrimination.3. Breaking barriers: Affirmative action can help break down barriers that have traditionally prevented minorities from accessingquality education or obtaining higher-level positions.
// User: What colleges uses affirmative action?
// Agent: Many colleges and universities in the United States use some form of affirmative action in their admissions processes. Affirmative action is intended to promote Many colleges and universities in the United States use some form of affirmative action in their admissions processes. Affirmative action is intended to promote practices of each institution may vary, several prominent universities known for their commitment to affirmative action include Ivy League schools such as Harvard University, Yale University, and Princeton University. Additionally, other prestigious institutions like Stanford University, the Massachusetts Institute of Technology (MIT), and the University of Chicago also consider diversity as an important factor in their admissions decisions. It is important to note that affirmative action policies are subject to legal challenges and vary across institutions and jurisdictions.
// User: What colleges uses affirmative action?
// Agent: Many colleges and universities in the United States use some form of affirmative action in their admissions processes. Affirmative action is intended to promote Many colleges and universities in the United States use some form of affirmative action in their admissions processes. Affirmative action is intended to promote practices of each institution may vary, several prominent universities known for their commitment to affirmative action include Ivy League schools such as Harvard University, Yale University, and Princeton University. Additionally, other prestigious institutions like Stanford University, the Massachusetts Institute of Technology (MIT), and the University of Chicago also consider diversity as an important factor in their admissions decisions. It is important to note that affirmative action policies are subject to legal challenges and vary across institutions and jurisdictions.
// User: What colleges uses affirmative action?
// Agent: Many colleges and universities in the United States use some form of affirmative action in their admissions processes. Affirmative action is intended to promote Many colleges and universities in the United States use some form of affirmative action in their admissions processes. Affirmative action is intended to promote practices of each institution may vary, several prominent universities known for their commitment to affirmative action include Ivy League schools such as Harvard University, Yale University, and Princeton University. Additionally, other prestigious institutions like Stanford University, the Massachusetts Institute of Technology (MIT), and the University of Chicago also consider diversity as an important factor in their admissions decisions. It is important to note that affirmative action policies are subject to legal challenges and vary across institutions and jurisdictions.
// User: What colleges uses affirmative action?
// Agent: Many colleges and universities in the United States use some form of affirmative action in their admissions processes. Affirmative action is intended to promote Many colleges and universities in the United States use some form of affirmative action in their admissions processes. Affirmative action is intended to promote practices of each institution may vary, several prominent universities known for their commitment to affirmative action include Ivy League schools such as Harvard University, Yale University, and Princeton University. Additionally, other prestigious institutions like Stanford University, the Massachusetts Institute of Technology (MIT), and the University of Chicago also consider diversity as an important factor in their admissions decisions. It is important to note that affirmative action policies are subject to legal challenges and vary across institutions and jurisdictions.
// `;

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

  // const formattedMsg = [
  //   {
  //     role: ChatCompletionRequestMessageRoleEnum.Assistant,
  //     content: sampleHistory,
  //   },
  //   {
  //     role: ChatCompletionRequestMessageRoleEnum.User,
  //     content: prompt,
  //   },
  // ];

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
      const result = await redis.rpush(from, formattedResponse);
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
            res.end();
            // Promise.resolve();
          }
        );
      } catch (e) {
        console.log(e);
        res.status(400).json({ error: "something wrong" });
        res.end();
        // Promise.resolve()
      }
    },
  });

  return new StreamingTextResponse(stream);
}
