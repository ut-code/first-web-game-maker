import * as vscode from "vscode";
import { type Command } from "../../types/command";
import shogiPieceTemplates from "./shogiTemplate/shogiPieceTemplates";

const insertShogiPieceTemplate = (input: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  let index = input !== "" ? parseInt(input) : 0;
  if (!index || index >= shogiPieceTemplates.length) {
    index = 0;
  }
  activeEditor.edit((edit) => {
    edit.insert(position, shogiPieceTemplates[index] + "\n");
  });
};

const shogiCommands: Command[] = [
  {
    name: "insertShogiPieceTemplate",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "駒テンプレートの id を入力してください(0 ~ 14)",
      });
      insertShogiPieceTemplate(input || "");
    },
  },
];

export default shogiCommands;
