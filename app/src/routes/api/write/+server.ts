import type { RequestHandler } from "@sveltejs/kit";
import { Configuration, OpenAIApi } from "openai";
import { Transform } from "stream";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_1,
});
const openai = new OpenAIApi(configuration);

export const POST: RequestHandler = async ({ request }) => {
    const { prompt, temperature, max_tokens } = await request.json();
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature,
        max_tokens,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true
    }, { responseType: 'stream' });
    const inoutStream = new Transform({
        transform(chunk, encoding, callback) {
            this.push(chunk);
            callback();
        },
    });

    completion.data.pipe(inoutStream);
    return new Response(inoutStream, {
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'text/event-stream',
        }
    });
}
