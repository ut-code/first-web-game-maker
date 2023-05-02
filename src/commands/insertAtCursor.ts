import * as vscode from "vscode";
import { type Command } from "../definitions/command";

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

const insertAtCursorCommand: Command = {
  name: "insertAtCursor",
  execute: async () => {
    const input = await vscode.window.showInputBox({
      prompt: "挿入する文字列を入力してください",
    });
    insertAtCursor(input || "");
  },
};

export default insertAtCursorCommand;
