import * as vscode from "vscode";
import { type Command } from "./../commands";

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

const insertHelloWorldAtTopCommand: Command = {
  name: "insertHelloWorldAtTop",
  execute: () => {
    insertHelloWorldAtTop();
  },
};

export default insertHelloWorldAtTopCommand;
