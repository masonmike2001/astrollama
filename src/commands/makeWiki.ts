import { Plugin, Notice } from "obsidian";
import {askOllama} from "../commands/askOllama"

export function registerMakeWiki(
    plugin: Plugin
) {
    plugin.addCommand({
                id: 'create-wiki',
                name: 'Create Wiki',
                editorCallback: async (editor) => {
                    // wiki template either default or custom fields user will enter in settings
                    const selected = editor.getSelection();
                    const template = "Summary, History, Uses"
                    new Notice("Processing wiki...");
                    const answer = await askOllama("You will create a structured and well formatted wiki article page for an Obsidian note following Obsidian formatting guidelines, including headers starting with # symbols and keeping the title of the entity as the first line. Ensure it follows only this standard layout: " + template +". Use these notes to create the wiki article: " + selected);
                    const firstLine = answer.split('\n')[0];

                    const cleaned = firstLine
                    .replace(/^#+\s*/, '')
                    .replace(/[*_`]/g, '')
                    .split(':')[0]
                    .trim();

                    editor.replaceSelection(selected + "\n********\n See more: " + "[[Wiki_"+  "" + cleaned + "" + ".md]]");
                    await plugin.app.vault.create(
                        `Wiki_${cleaned}.md`,
                        answer
                    );

                    new Notice("Wiki created at " + `Wiki_${cleaned}.md`);


                },
            });
}