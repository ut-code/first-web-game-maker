import * as vscode from "vscode";
import { type Command } from "../../types/command";
import shogiPieceTemplates from "./shogiTemplate/shogiPieceTemplates";
import shogiInitialPieceTemplate from "./shogiTemplate/shogiInitialPieceTemplate";
import shogiConfigTemplate from "./shogiTemplate/shogiConfigTemplate";
import shogiStyleTemplate from "./shogiTemplate/shogiStyleTemplate";

const insertShogiConfigTemplate = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, shogiConfigTemplate + "\n");
  });
};

const insertShogiStyleTemplate = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, shogiStyleTemplate + "\n");
  });
};

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

const insertShogiInitialPieceTemplate = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, shogiInitialPieceTemplate + "\n");
  });
};

const shogiCommands: Command[] = [
  {
    name: "insertShogiConfigTemplate",
    execute: insertShogiConfigTemplate,
  },
  {
    name: "insertShogiStyleTemplate",
    execute: insertShogiStyleTemplate,
  },
  {
    name: "insertShogiPieceTemplate",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "駒テンプレートの id を入力してください(0 ~ 14)",
      });
      insertShogiPieceTemplate(input || "");
    },
  },
  {
    name: "insertShogiInitialPieceTemplate",
    execute: insertShogiInitialPieceTemplate,
  },
];

export default shogiCommands;
