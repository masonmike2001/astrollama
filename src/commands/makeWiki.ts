import { Plugin, Notice } from "obsidian";
import {askOllama} from "../commands/askOllama"
import AstroLlama from "../main";



export function registerMakeWiki(
    plugin: AstroLlama
) {
    plugin.addCommand({
                id: 'create-wiki',
                name: 'Create Wiki',
                editorCallback: async (editor) => {
                    // wiki template either default or custom fields user will enter in settings
const selected = editor.getSelection();

const notes = await plugin.getContext(selected);

const context = notes
    .map(n => `FILE: ${n.file.path}\n${n.content}`)
    .join("\n\n---\n\n");

                    const template = "Summary, History, Uses"
                    new Notice("Processing wiki...");
                    const answer = await askOllama(
`
You will create a structured and well formatted wiki article page for an Obsidian note.

Follow this layout:
${template}

Use ONLY the context below.

CONTEXT:
${context}

SOURCE NOTE:
${selected}
`
//ADD THE MODEL this.settings.ollamaModel
, plugin.settings.ollamaModel);

const firstLine = answer.split("\n")[0];

if (!firstLine) {
    throw new Error("Ollama returned an empty wiki title");
}

const cleaned = firstLine
    .replace(/^#+\s*/, '')
    .replace(/[*_`]/g, '')
    .split(':')[0]
    ?.trim() ?? "Untitled";

                const folder = "AstroLlama";

				if (!await plugin.app.vault.adapter.exists(folder)) {
					await plugin.app.vault.createFolder(folder);
				}
				if (!await plugin.app.vault.adapter.exists(`${folder}/Wiki`)) {
					await plugin.app.vault.createFolder(`${folder}/Wiki`);
				}


                    // editor.replaceSelection(selected + "\n********\n See more: " + "[[Wiki_"+  "" + cleaned + "" + ".md]]");
                    await plugin.app.vault.create(
                        `${folder}/Wiki/${cleaned}.md`,
                        answer
                    );

                    new Notice("Wiki created at " + `Wiki_${cleaned}.md`);


                },
            });
}