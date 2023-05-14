import * as vscode from "vscode";
import { type Command } from "../../types/command";
import shogiHtml from "./shogiTemplate/shogiHtml";

const insertShogiHtmlAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, shogiHtml);
  });
};

const insertShogiHtmlAtTopCommand: Command = {
  name: "insertShogiHtmlAtTop",
  execute: () => {
    insertShogiHtmlAtTop();
  },
};

export default insertShogiHtmlAtTopCommand;
