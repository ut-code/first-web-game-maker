import * as vscode from "vscode";
import { type Command } from "../../types/command";
import sugorokuHtml from "./sugorokuTemplate/sugorokuHtml";

const insertSugorokuAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuHtml + "\n");
  });
};

const insertSugorokuAtTopCommand: Command = {
  name: "insertSugorokuAtTop",
  execute: () => {
    insertSugorokuAtTop();
  },
};

export default insertSugorokuAtTopCommand;