// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "first-web-game-maker",
    "First Web Game Maker",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
    }
  );

  panel.webview.html = `
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <title>Title</title>
      </head>
      <body>
        <button id="omikuji-button" type="button">おみくじを引く</button>
        <div id="result"></div>
        <script>
          let omikujiButton = document.getElementById("omikuji-button");
          let result = document.getElementById("result");

          function omikuji() {
            let r = Math.random();
            if (r < 0.2) {
              result.textContent = "大吉";
              result.style.color = "red";
            } else if (r < 0.7) {
              result.textContent = "吉";
              result.style.color = "black";
            } else {
              result.textContent = "凶";
              result.style.color = "blue";
            }
          }
          omikujiButton.onclick = omikuji;
        </script>
      </body>
    </html>
  `;

  context.subscriptions.push(panel);
}

// This method is called when your extension is deactivated
export function deactivate() {}
