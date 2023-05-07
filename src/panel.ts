import * as vscode from "vscode";
import convertMarkdownToHtml from "./utils/convertMarkdownToHtml";

export default function createPanel(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "first-web-game-maker",
    "First Web Game Maker",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
    }
  );

  panel.webview.html = convertMarkdownToHtml(
    "./contents/descriptions/htmlDescription.md"
  );

  panel.webview.onDidReceiveMessage(
    (message) => {
      if (message.type === "html") {
        panel.webview.html = convertMarkdownToHtml(
          "./contents/descriptions/htmlDescription.md"
        );
      } else if (message.type === "test") {
        panel.webview.html = convertMarkdownToHtml(
          "./contents/descriptions/test.md"
        );
      }
    },
    undefined,
    context.subscriptions
  );

  return panel;
}
