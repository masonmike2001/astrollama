import { App, PluginSettingTab, Setting } from "obsidian";
import type Astrollama from "./main";


export interface MyPluginSettings {
    mySetting: string;
    contextFolder: string;
    ollamaModel: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: "default",
    contextFolder: "",
    ollamaModel: "llama3.2"
};

async function getOllamaModels(): Promise<string[]> {
    try {
        const response = await fetch(
            "http://localhost:11434/api/tags"
        );

        const data = await response.json();

        return data.models.map(
            (model: any) => model.name
        );

    } catch (error) {
        console.error(
            "Could not connect to Ollama",
            error
        );

        return [];
    }
}

export class SampleSettingTab extends PluginSettingTab {

    plugin: Astrollama;

    constructor(app: App, plugin: Astrollama) {
        super(app, plugin);
        this.plugin = plugin;
    }


display(): void {
    const containerEl = this.containerEl;
    const plugin = this.plugin;
    const vault = this.app.vault;

    containerEl.empty();

    const folders = new Set<string>();

    vault.getAllLoadedFiles().forEach((file) => {
        if ("children" in file) {
            folders.add(file.path);
        }
    });


    new Setting(containerEl)
        .setName("Ollama Model")
        .setDesc("Choose the Ollama model to use.")
        .addDropdown(dropdown => {

            dropdown.addOption("", "Loading models...");

            getOllamaModels().then(models => {

                dropdown.selectEl.empty();

                models.forEach(model => {
                    dropdown.addOption(model, model);
                });

                dropdown.setValue(
                    plugin.settings.ollamaModel
                );
            });


            dropdown.onChange(async (value) => {
                plugin.settings.ollamaModel = value;
                await plugin.saveSettings();
            });
        });



    new Setting(containerEl)
        .setName("Context folder")
        .addDropdown(dropdown => {

            dropdown.addOption("", "Entire Vault");

            folders.forEach(folder => {
                dropdown.addOption(folder, folder);
            });

            dropdown.setValue(
                plugin.settings.contextFolder
            );

            dropdown.onChange(async (value) => {
                plugin.settings.contextFolder = value;
                await plugin.saveSettings();
            });
        });
}
}