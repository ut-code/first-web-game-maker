// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "first-web-game-maker.paperFortune",
    () => {
      const randomNumber = Math.random();
      if (randomNumber < 0.2) {
        vscode.window.showInformationMessage("大吉");
      } else if (randomNumber < 0.7) {
        vscode.window.showInformationMessage("吉");
      } else {
        vscode.window.showInformationMessage("凶");
      }
    }
  );

  context.subscriptions.push(disposable);

  const button = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  button.text = "おみくじを引く";
  button.command = "first-web-game-maker.paperFortune";
  context.subscriptions.push(button);
  button.show();
}

// This method is called when your extension is deactivated
export function deactivate() {}
