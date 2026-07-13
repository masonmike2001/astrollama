import { requestUrl } from "obsidian";

export async function askOllama(
    prompt: string,
    model: string
): Promise<string> {

    console.log("Ollama model:", model);
    console.log("Prompt length:", prompt.length);


    const response = await requestUrl({
        url: "http://localhost:11434/api/generate",

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            model: model,
            prompt: prompt,
            stream: false,

            options: {
                num_predict: 2000
            }
        })
    });


    console.log("Ollama raw response:", response);


    if (!response.json) {
        throw new Error(
            "No JSON returned from Ollama"
        );
    }


    return response.json.response;
}