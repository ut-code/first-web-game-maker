import * as vscode from "vscode";
import { type Command } from "../../types/command";
import shogiScriptJs from "./shogiTemplate/shogiScriptJs";

const insertShogiScriptJsAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, shogiScriptJs);
  });
};

const insertShogiScriptJsAtTopCommand: Command = {
  name: "insertShogiScriptJsAtTop",
  execute: () => {
    insertShogiScriptJsAtTop();
  },
};

export default insertShogiScriptJsAtTopCommand;
