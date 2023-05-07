import * as vscode from "vscode";

import commands from "./commands";
import treeView from "./treeView";
import createPanel from "./panel";

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

  context.subscriptions.push(createPanel(context));
}

export function deactivate() {}
