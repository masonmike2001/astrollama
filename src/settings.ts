import { App, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';

export interface MyPluginSettings {
	mySetting: string;
	contextFolder: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	contextFolder: ""
};

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

const folders = new Set<string>();

this.app.vault.getAllLoadedFiles().forEach(file => {
    if ("children" in file) {
        folders.add(file.path);
    }
});

new Setting(containerEl)
    .setName("Context folder")
    .addDropdown(drop => {
        drop.addOption("", "Entire Vault");

        [...folders]
            .sort()
            .forEach(folder => {
                drop.addOption(folder, folder);
            });

        drop
            .setValue(this.plugin.settings.contextFolder)
            .onChange(async value => {
                this.plugin.settings.contextFolder = value;
                await this.plugin.saveSettings();
            });
    });
	
	
}
}