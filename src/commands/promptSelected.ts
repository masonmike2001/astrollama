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

            const selected = editor.getSelection();

            const notes = await plugin.keywordSearch(selected);

            const context = notes
                .map(n => `FILE: ${n.file.path}\n${n.content}`)
                .join("\n\n---\n\n");


            const prompt = `
You are an assistant working inside Obsidian.

Use the context below when answering.

CONTEXT:
${context}

USER REQUEST:
${selected}


`;

			new Notice("Running selected prompt against vault context...");
            const answer = await askOllama(prompt);
new Notice("Completed prompt.");
            editor.replaceSelection(
                selected +
                "\n\n********\n" +
                answer +
                "\n********\n"
            );
        },
    });
}


