
import axios from 'axios'
export default async function MODEL({ query, model, history, apiKey, url }) {
    if (!model) {
        model = "gpt-3.5-turbo"
    }
    if (!history) {
        history = []
    }
    if (!url) {
        url = "https://api.openai.com/v1/chat/completions"
    }
    if (!apiKey) {
        apiKey = process.env.OPENAI_API_KEY;
    }
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };
    const QUERY = query;
    const MODED_QUERY = `My question is ${QUERY}. Please answer this by breaking up the response into an array of objects consisting of 150 characters Append the the array index and a period to the start of each text and send me back an array only`
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

    console.log(response, 'response');
    if (response.choices[0].message.content) {
        return JSON.parse(response.choices[0].message.content)
    }
}
