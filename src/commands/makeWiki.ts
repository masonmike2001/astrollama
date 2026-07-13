import { Notice, TFile } from "obsidian";
import { askOllama } from "../commands/askOllama";
import AstroLlama from "../main";


export function registerMakeWiki(
    plugin: AstroLlama
) {

    plugin.addCommand({

        id: "create-wiki",

        name: "AstroLlama: Create Wiki from Selection",

        editorCallback: async (editor) => {

            const selected = editor.getSelection();

            if (!selected.trim()) {
                new Notice("Select some text first.");
                return;
            }


            const notice = new Notice(
                "🦙 Building wiki context...",
                0
            );


            try {

                // Retrieve related notes
                const notes = await plugin.getContext(selected);


                notice.setMessage(
                    `📚 Found ${notes.length} context notes`
                );


                const context = notes
                    .map(
                        n =>
                        `FILE: ${n.file.path}\n${n.content}`
                    )
                    .join("\n\n---\n\n")
                    .slice(0, 10000);



                const prompt = `You are creating an Obsidian wiki article.

PRIMARY TASK:
Create a wiki page about the EXACT topic in TARGET TOPIC.

TARGET TOPIC:
${selected}


IMPORTANT RULES:
- The title must be based on TARGET TOPIC.
- The entire article must focus on TARGET TOPIC.
- CONTEXT is only supporting information.
- Never change the subject based on CONTEXT.
- Ignore unrelated context.
- Do not create an article about a topic mentioned only in CONTEXT.


Supporting context from vault:

${context}

Required structure:

${plugin.settings.wikiTemplate}
`;



                notice.setMessage(
                    `🦙 Generating with ${plugin.settings.ollamaModel}...`
                );


                const answer = await askOllama(
                    prompt,
                    plugin.settings.ollamaModel
                );



                const title =
                    extractTitle(answer);



                const filename =
                    sanitizeFilename(title);



                await plugin.ensureFolder(
                    "AstroLlama/Wiki"
                );


                const path =
                    `AstroLlama/Wiki/${filename}.md`;



                const existing =
                    plugin.app.vault
                    .getAbstractFileByPath(path);



                if (existing instanceof TFile) {

                    await plugin.app.vault.modify(
                        existing,
                        answer
                    );

                    new Notice(
                        `Updated wiki: ${filename}`
                    );

                } else {

                    await plugin.app.vault.create(
                        path,
                        answer
                    );

                    new Notice(
                        `Created wiki: ${filename}`
                    );
                }



                // Add wiki backlink
                editor.replaceSelection(
`${selected}

See wiki:
[[${filename}]]
`
                );


                notice.hide();


            } catch(error) {

                console.error(
                    "Wiki generation failed:",
                    error
                );


                notice.setMessage(
                    "❌ Wiki generation failed"
                );

            }

        }

    });

}



function extractTitle(
    answer: string
): string {


    const firstLine =
        answer.split("\n")[0];


    if (!firstLine) {
        return "Untitled";
    }


    return firstLine
        .replace(/^#+\s*/, "")
        .replace(/[*_`]/g, "")
        .split(":")[0]
        ?.trim()
        ||
        "Untitled";
}



function sanitizeFilename(
    name: string
): string {

    return name
        .replace(/[\\/:*?"<>|]/g, "")
        .trim()
        .substring(0, 100);

}