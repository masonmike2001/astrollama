import { Plugin } from "obsidian";

import { askOllama } from "./askOllama";

export function registerPromptSelected(
    plugin: Plugin
) {
		plugin.addCommand({
			id: 'prompt-selected',
			name: 'Prompt Selected',
			editorCallback: async (editor) => {
				const selected = editor.getSelection();
				const answer = await askOllama(selected);
				editor.replaceSelection(selected + "\n********\n " + answer + "\n********\n");
			},
		});
}



