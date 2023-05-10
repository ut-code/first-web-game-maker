import * as vscode from "vscode";
import { type Command } from "../../types/command";
import shogiJs from "./shogiTemplate/shogiJs";

const insertShogiJsAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, shogiJs + "\n");
  });
};

const insertShogiJsAtTopCommand: Command = {
  name: "insertShogiJsAtTop",
  execute: () => {
    insertShogiJsAtTop();
  },
};

export default insertShogiJsAtTopCommand;
