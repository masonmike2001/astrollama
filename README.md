# AstroLlama

AstroLlama is an Obsidian plugin that integrates local AI models via Ollama, bringing fast, private, and flexible AI workflows directly into your notes.

It allows you to prompt AI from selected text, generate structured content, and automatically create linked wiki-style notes inside your vault.

## ✨ Features
- Run AI prompts directly inside Obsidian using Ollama
- Generate structured wiki-style articles from notes or prompts
- Automatically create new notes from AI output
- Insert Obsidian internal links to generated content
- Use selection-based editing for rewriting or expanding text
- Fully local workflow (no external API required)

## 🧠 Use Cases
- Turn rough notes into structured wiki pages
- Expand or rewrite selected text with AI
- Generate documentation from ideas or snippets
- Build a personal knowledge base powered by local LLMs

## ⚙️ Requirements
- Obsidian
- Ollama installed and running locally
- A compatible model installed (e.g. Llama, Mistral, etc.)

## 🚀 How It Works

AstroLlama connects Obsidian’s editor API with Ollama. You can:

- Select text or write a prompt inside a note
- Trigger the plugin command
- Receive AI-generated output directly in your vault
- Optionally generate a structured wiki page with automatic linking

## 📦 Installation
Manual Installation:
- Download or clone this repository

- Build the plugin:

	1. npm install
	2. npm run build

3. Copy the following files into your vault:
.obsidian/plugins/astrollama/
4. Enable the plugin in Obsidian settings



## 🧩 Example Workflow
- Select rough notes inside Obsidian
- Run “Generate Wiki Page”
- AstroLlama creates a structured markdown article
- A new note is created in your vault
- A link is inserted back into your original note

## 🛠️ Built With
- Obsidian Sample Plugin (starter template)
- Ollama local LLM runtime
- TypeScript
## 📌 Notes

This plugin is designed for local-first AI workflows. All processing happens through your local Ollama instance—no data is sent to external APIs.

## 📄 License

MIT License