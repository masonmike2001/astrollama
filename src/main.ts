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


// Remember to rename these classes and interfaces!

// AFTER UPDATE RUN npm run dev!!

export default class Astrollama extends Plugin {
	settings!: MyPluginSettings;

	async onload() {
		await this.loadSettings();


		this.addCommand({
			id: 'prompt-selected',
			name: 'Prompt Selected',
			editorCallback: async (editor) => {
				const selected = editor.getSelection();
				const answer = await askOllama(selected);
				editor.replaceSelection(selected + "\n********\n " + answer + "\n********\n");
			},
		});

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
// 		this.addCommand({
// 			id: "hello",
// 			name: "Say Hello",
// 			callback: () => {
// 				console.log("hello");
// 			}
// 		});
// 		this.addCommand({
// 			id: "count-words",
// 			name: "Count Words",
// 			editorCallback: (editor) => {
// 				const text = editor.getSelection().trim();
// 				const words = text === ""
//     			? 0
//     			: text.split(/\s+/).length;
// 				new Notice(`Word Count: ${words}`);
// 			}
// 		});
// 		this.addCommand({
// 			id: "insert-timestamp",
// 			name: "Insert Timestamp",
// 			editorCallback: (editor) => {
// 				const current = editor.getValue();
// 				editor.setValue(current + " " + new Date());
// 			}
// 		});
// 		this.addCommand({
// 			id: "create-daily-reflection",
// 			name: "Create Daily Reflection",
// 			callback: async () => {

// 				const content = `# Reflection

// ## Wins

// ## Challenges

// ## Tomorrow
// `;

// 				await this.app.vault.create(
// 					"Reflection.md",
// 					content
// 				);

// 				new Notice("Reflection note created!");
// 			}
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

async function askOllama(prompt: string) {
	const response = await requestUrl({
			url: "http://localhost:11434/api/generate",
			method: "POST",
			contentType: "application/json",
			body: JSON.stringify({
				model: "hf.co/mradermacher/MN-Violet-Lotus-12B-GGUF:Q4_K_M",
				prompt,
				stream: false
			})
		});
	
	return response.json.response;

}