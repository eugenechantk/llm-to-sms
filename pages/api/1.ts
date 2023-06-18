
import axios from 'axios'
export default async function MODEL(query: any, model = "gpt-3.5-turbo", apiKey = process.env.OPENAI_API_KEY, url = "https://api.openai.com/v1/chat/completions", history = []) {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };
    const QUERY = query;
    const MODED_QUERY = `My question is ${QUERY}. Please answer this by breaking up the response into an array of objects consisting of 150 characters. Send it as array of objects`
    const body = {
        model,
        messages: [
            {
                role: "user",
                content: MODED_QUERY,
            },
        ],
        temperature: 1,
    };
    const controller = new AbortController();
    const response = (await axios.post(url, body, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
    })).data;

    if (response.choices[0].message.content) {
        return response.choices[0].message.content
    }
}
