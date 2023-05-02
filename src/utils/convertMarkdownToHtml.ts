import * as path from "path";
import * as fs from "fs";
import * as MarkdownIt from "markdown-it";
import hljs from "highlight.js";

/**
 * Convert markdown file to html string
 * @param {string} filePath - the path of markdown file
 * @returns {string} html - the html string
 * @description
 * convertMarkdownToHtml is a function that converts markdown file to html string.
 * It is used to display the markdown file in the webview.
 */
export default function convertMarkdownToHtml(filePath: string): string {
  // throw error if file extension is not ".md"
  if (path.extname(filePath) !== ".md") {
    throw new Error(`Invalid file type: ${filePath}`);
  }

  //   // import file content
  //   const fileContent = fs.readFileSync(
  //     path.join(__dirname, path.join("./../../src", filePath)),
  //     {
  //       encoding: "utf-8",
  //     }
  //   );
  const fileContent = `\
# First Web Game Maker

使い方の説明を Markdown で書けます！

**太字**はこんな感じで書けます。

~~取り消し線~~も書けます。

コードブロックはこんな感じで書けます。なんと、シンタックスハイライトもできます！

\`\`\`js
document.write("Hello, World!");
\`\`\`

HTML もこんな感じでかけます。このボタンは、Webview から VS Code にメッセージを送るサンプルです。ボタンを押すと、VS Code のウィンドウにメッセージが表示されます。

<button id="alert">alert</button>

<script>
const vscode = acquireVsCodeApi();
document.getElementById("alert").onclick = () =>{
    vscode.postMessage({type: "alert", message: "Hello, World!"});
}
</script>`;

  // convert markdown to html
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return "";
    },
  });
  const html =
    md.render(fileContent) +
    `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css">`;

  return html;
}
