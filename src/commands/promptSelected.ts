import { Notice, Plugin } from "obsidian";


import AstroLlama from "../main";

import { askOllama } from "./askOllama";

export function registerPromptSelected(
    plugin: AstroLlama
) {
    plugin.addCommand({
        id: 'prompt-selected',
        name: 'Prompt Selected',

        editorCallback: async (editor) => {
			const notice = new Notice("🔎 Searching context...", 0);
            const selected = editor.getSelection();

            const notes = await plugin.keywordSearch(selected);
			notice.setMessage(
				`📚 Found ${notes.length} notes. Building prompt...`
			);
            const context = notes
                .map(n => `FILE: ${n.file.path}\n${n.content}`)
                .join("\n\n---\n\n");

 notice.setMessage(
        `🦙 Sending request to ${plugin.settings.ollamaModel}...`
    );
            const prompt = `
			You are an assistant working inside Obsidian.

			Use the context below when answering.

			CONTEXT:
			${context}

			USER REQUEST:
			${selected}
			`;

	
			
const answer = await askOllama(
    prompt,
    plugin.settings.ollamaModel
);
  notice.setMessage("✅ Ollama finished generating");

      setTimeout(() => {
        notice.hide();
    }, 2000);
            editor.replaceSelection(
                selected +
                "\n\n********\n" +
                answer +
                "\n********\n"
            );
        },
    });
}


