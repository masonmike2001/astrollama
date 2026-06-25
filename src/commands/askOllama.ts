
import { Plugin, requestUrl } from "obsidian";



export async function askOllama(prompt: string) {
	const response = await requestUrl({
			url: "http://localhost:11434/api/generate",
			method: "POST",
			contentType: "application/json",
			body: JSON.stringify({
				model: "hf.co/mradermacher/MN-Violet-Lotus-12B-GGUF:Q4_K_M",
				prompt,
				stream: false
			})
		});
	
	return response.json.response;

}