import * as vscode from "vscode";
import { type Command } from "../../types/command";
import shogiCustomShogiJs from "./shogiTemplate/shogiCustomShogiJs";

const insertShogiCustomShogiJsAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, shogiCustomShogiJs);
  });
};

const insertShogiCustomShogiJsAtTopCommand: Command = {
  name: "insertShogiCustomShogiJsAtTop",
  execute: () => {
    insertShogiCustomShogiJsAtTop();
  },
};

export default insertShogiCustomShogiJsAtTopCommand;
