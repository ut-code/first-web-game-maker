import * as vscode from "vscode";
import { type Command } from "../../types/command";
import shogiPieceTemplate from "./shogiTemplate/shogiPieceTemplate";

const insertShogiPieceTemplate = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, shogiPieceTemplate + "\n");
  });
};

const shogiCommands: Command[] = [
  {
    name: "insertShogiPieceTemplate",
    execute: () => {
      insertShogiPieceTemplate();
    },
  },
];

export default shogiCommands;
