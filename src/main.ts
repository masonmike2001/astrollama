import {
	Editor,
	MarkdownView,
	MarkdownFileInfo,
	Modal,
	Notice,
	Plugin,
	requestUrl
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	SampleSettingTab,
} from './settings';

import { registerMakeWiki } from "./commands/makeWiki";
import { registerPromptSelected } from "./commands/promptSelected";
import { askOllama } from './commands/askOllama';


// Remember to rename these classes and interfaces!

// AFTER UPDATE RUN npm run dev!!

export default class AstroLlama extends Plugin {
	settings!: MyPluginSettings;

	async onload() {
		await this.loadSettings();
        registerMakeWiki(this);
		registerPromptSelected(this);


		this.addCommand({
            id: "ask-vault",
            name: "Ask Vault (keyword + Ollama)",

            editorCallback: async (editor) => {

                // 1. get question (temporary hardcoded)
                const question = editor.getSelection();

                // 2. retrieve notes via keyword search
                const notes = await this.keywordSearch(question);

                // 3. build context
                const context = notes
                    .map(n => `FILE: ${n.file.path}\n${n.content}`)
                    .join("\n\n---\n\n");

                // 4. build RAG prompt
                const prompt = `
				You are an assistant answering questions using Obsidian notes.

				Use ONLY the context below.

				CONTEXT:
				${context}

				QUESTION:
				${question}

				Answer clearly and concisely.
								`;

                // 5. call Ollama
				const notice = new Notice("Sending prompt to Ollama...", 0);

			try {
				notice.setMessage("Generating response...");

				const answer = await askOllama(prompt);

				notice.setMessage("Done!");

				setTimeout(() => notice.hide(), 1000);

			    // 6. save result as note
                const clean = question
                    .replace(/^#+\s*/, '')
                    .replace(/[*_`]/g, '')
                    .trim()
					.toLowerCase()
					;

				const folder = "AstroLlama";

				if (!await this.app.vault.adapter.exists(folder)) {
					await this.app.vault.createFolder(folder);
				}
				if (!await this.app.vault.adapter.exists("Ask")) {
					await this.app.vault.createFolder(`${folder}/Ask`);
				}

                await this.app.vault.create(
                    `${folder}/Ask/${clean}.md`,
                    answer
                );

                new Notice("AskVault complete");

			} catch (e) {
				notice.setMessage("Error calling Ollama");
			}


            }
        });
    }
async keywordSearch(query: string) {
        const files = this.app.vault.getMarkdownFiles();

        const results: any[] = [];

        for (const file of files) {
            const content = await this.app.vault.read(file);

            const score = this.score(content, query);

            if (score > 0) {
                results.push({ file, content, score });
            }
        }

        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }

    score(content: string, query: string) {
        const words = query.toLowerCase().split(/\s+/);
        const text = content.toLowerCase();

        let score = 0;

        for (const w of words) {
            score += (text.match(new RegExp(w, "g")) || []).length;
        }

        return score;
    



		



// 		// This creates an icon in the left ribbon.
// 		this.addRibbonIcon('dice', 'Sample', (_evt: MouseEvent) => {
// 			// Called when the user clicks the icon.
// 			new Notice('This is a notice!');
// 		});

// 		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
// 		const statusBarItemEl = this.addStatusBarItem();
// 		statusBarItemEl.setText('Status bar text');

// 		// This adds a simple command that can be triggered anywhere
// 		this.addCommand({
// 			id: 'open-modal-simple',
// 			name: 'Open modal (simple)',
// 			callback: () => {
// 				new SampleModal(this.app).open();
// 			},
// 		});
// 		// This adds an editor command that can perform some operation on the current editor instance
// 		this.addCommand({
// 			id: 'replace-selected',
// 			name: 'Replace selected content',
// 			editorCallback: (
// 				editor: Editor,
// 				_ctx: MarkdownView | MarkdownFileInfo,
// 			) => {
// 				editor.replaceSelection('Sample editor command');
// 			},
// 		});


// 		// This adds a complex command that can check whether the current state of the app allows execution of the command
// 		this.addCommand({
// 			id: 'open-modal-complex',
// 			name: 'Open modal (complex)',
// 			checkCallback: (checking: boolean) => {
// 				// Conditions to check
// 				const markdownView =
// 					this.app.workspace.getActiveViewOfType(MarkdownView);
// 				if (markdownView) {
// 					// If checking is true, we're simply "checking" if the command can be run.
// 					// If checking is false, then we want to actually perform the operation.
// 					if (!checking) {
// 						new SampleModal(this.app).open();
// 					}

// 					// This command will only show up in Command Palette when the check function returns true
// 					return true;
// 				}
// 				return false;
// 			},
// 		});

// 		// This adds a settings tab so the user can configure various aspects of the plugin
// 		this.addSettingTab(new SampleSettingTab(this.app, this));

// 		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
// 		// Using this function will automatically remove the event listener when this plugin is disabled.
// 		this.registerDomEvent(activeDocument, 'click', (_evt: MouseEvent) => {
// 			new Notice('Click');
// 			// 
// 		});

// 		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
// 		this.registerInterval(
// 			window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000),
// 		);

// 		console.log("loaded");


	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	
}

class SampleModal extends Modal {
	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

