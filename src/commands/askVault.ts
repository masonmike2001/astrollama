import { Plugin } from "obsidian";

export function registerAskVaultCommand(
    plugin: Plugin
) {
    plugin.addCommand({
        id: "ask-vault",
        name: "Ask Vault",
        callback: async () => {
            console.log("Ask Vault");
        }
    });
}