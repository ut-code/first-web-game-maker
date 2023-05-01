import * as vscode from "vscode";

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

export default insertAtCursor;
