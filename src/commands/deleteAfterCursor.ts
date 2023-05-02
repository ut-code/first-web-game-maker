import * as vscode from "vscode";
import { type Command } from "../types/command";

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

const deleteAfterCursorCommand: Command = {
  name: "deleteAfterCursor",
  execute: async () => {
    const input = await vscode.window.showInputBox({
      prompt: "削除する文字数を入力してください",
      value: "1",
    });
    deleteAfterCursor(parseInt(input || "1"));
  },
};

export default deleteAfterCursorCommand;
