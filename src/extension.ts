import * as vscode from "vscode";

import commands from "./commands";
import treeView from "./treeView";
import convertMarkdownToHtml from "./utils/convertMarkdownToHTML";

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

  panel.webview.html = convertMarkdownToHtml("descriptions/htmlDescription.md");

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
}

export function deactivate() {}
