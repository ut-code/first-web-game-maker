import * as vscode from "vscode";
import { hoverContents } from "./hoverContents";
import commands from "./commands";
import treeView from "./treeView";
import createPanel from "./panel";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...commands);

  context.subscriptions.push(treeView);

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
