// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
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

  const insertHelloWorldAtTop = () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }
    const position = new vscode.Position(0, 0);
    activeEditor.edit((edit) => {
      edit.insert(position, "Hello, World!\n");
    });
  };

  const insertAtCursor = (text: string) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }
    const position = activeEditor.selection.active;
    activeEditor.edit((edit) => {
      edit.insert(position, text);
    });
  };

  const deleteAfterCursor = (chars: number) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }
    const position = activeEditor.selection.active;
    activeEditor.edit((edit) => {
      edit.delete(
        new vscode.Range(
          position,
          new vscode.Position(position.line, position.character + chars)
        )
      );
    });
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "first-web-game-maker.insertHelloWorldAtTop",
      () => {
        insertHelloWorldAtTop();
      }
    ),
    vscode.commands.registerCommand(
      "first-web-game-maker.insertAtCursor",
      async () => {
        const input = await vscode.window.showInputBox({
          prompt: "挿入する文字列を入力してください",
        });
        insertAtCursor(input || "");
      }
    ),
    vscode.commands.registerCommand(
      "first-web-game-maker.deleteAfterCursor",
      async () => {
        const input = await vscode.window.showInputBox({
          prompt: "削除する文字数を入力してください",
          value: "1",
        });
        deleteAfterCursor(parseInt(input || "1"));
      }
    )
  );

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
        <title>おみくじアプリ</title>
      </head>
      <body>
        <button id="omikuji-button" type="button">おみくじを引く</button>
        <script>
          const vscode = acquireVsCodeApi();
          document.getElementById("omikuji-button").onclick = () => {
            const r = Math.random();
            if (r < 0.2) {
              vscode.postMessage({ type: "omikuji", result: "大吉" });
            } else if (r < 0.7) {
              vscode.postMessage({ type: "omikuji", result: "吉" });
            } else {
              vscode.postMessage({ type: "omikuji", result: "凶" });
            }
          }
        </script>
      </body>
    </html>
  `;

  panel.webview.onDidReceiveMessage(
    (message) => {
      if (message.type === "omikuji") {
        vscode.window.showInformationMessage(message.result);
      }
    },
    undefined,
    context.subscriptions
  );

  context.subscriptions.push(panel);
}

// This method is called when your extension is deactivated
export function deactivate() {}
