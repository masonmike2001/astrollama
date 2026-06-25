import { Plugin } from "obsidian";

export function registerAskVaultCommand(
    plugin: Plugin
) {
    plugin.addCommand({
        id: "ask-vault",
        name: "Ask Vault",
        callback: async () => {

            // in: user provides a question and a directory to search



            // out: plugin provides a note after selection with answer, using context of the notes




            console.log("Ask Vault");
        }
    });
}