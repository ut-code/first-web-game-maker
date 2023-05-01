import * as vscode from "vscode";

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

export default insertHelloWorldAtTop;
