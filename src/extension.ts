import * as vscode from "vscode";
import { hoverContents } from "./hoverContents";
import * as MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import commands from "./commands";
import treeView from "./treeView";
import createPanel from "./panel";

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

export function activate(context: vscode.ExtensionContext) {
  // const files = vscode.workspace.textDocuments;
  // const paths = { scriptJs: "", indexHtml: "" };

  // for (const file of files) {
  //   if (file.fileName.endsWith("script.js")) {
  //     paths.scriptJs = file.fileName;
  //   } else if (file.fileName.endsWith("index.html")) {
  //     paths.indexHtml = file.fileName;
  //   }
  // }
  // console.log(`${paths.scriptJs}, ${paths.indexHtml}`);

  // vscode.workspace.openTextDocument(paths.scriptJs);
  // vscode.workspace.openTextDocument(paths.indexHtml);

  context.subscriptions.push(...commands);

  context.subscriptions.push(treeView);

  const panel = vscode.window.createWebviewPanel(
    "first-web-game-maker",
    "First Web Game Maker",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
    }
  );

  panel.webview.html = renderMd(`\
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
</script>
`);

  panel.webview.onDidReceiveMessage(
    (message) => {
      if (message.type === "alert") {
        vscode.window.showInformationMessage(message.message);
      }
    },
    undefined,
    context.subscriptions
  );

  context.subscriptions.push(panel);

  class GoHoverProvider implements vscode.HoverProvider {
    public provideHover(
      document: vscode.TextDocument,
      position: vscode.Position
    ): vscode.ProviderResult<vscode.Hover> {
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      return new vscode.Hover(hoverContents.get(word) || "");
    }
  }

  context.subscriptions.push(
    vscode.languages.registerHoverProvider("javascript", new GoHoverProvider())
  );
  
  context.subscriptions.push(createPanel(context));
}

export function deactivate() {}
