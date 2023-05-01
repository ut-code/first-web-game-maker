import * as vscode from "vscode";
import { type Command } from "../definitions/command";

const insertDivElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<div id="${idName}"></div>`);
  });
};

const insertButtonElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<button id="${idName}">ボタン</button>`);
  });
};

const insertInputElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<input id="${idName}" />`);
  });
};

const insertUnorderedListElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(
      position,
      `\
<ul id="${idName}">
  <li></li>
</ul>`
    );
  });
};

const insertH1ElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<h1 id="${idName}">見出し</h1>`);
  });
};

const insertParagraphElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<p id="${idName}">段落</p>`);
  });
};

const htmlCommands: Command[] = [
  {
    name: "insertDivElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `div` 要素の `id` 属性を入力してください",
      });
      insertDivElementAtCursor(input || "");
    },
  },
  {
    name: "insertButtonElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `button` 要素の `id` 属性を入力してください",
      });
      insertButtonElementAtCursor(input || "");
    },
  },
  {
    name: "insertInputElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `input` 要素の `id` 属性を入力してください",
      });
      insertInputElementAtCursor(input || "");
    },
  },
  {
    name: "insertUnorderedListElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `ul` 要素の `id` 属性を入力してください",
      });
      insertUnorderedListElementAtCursor(input || "");
    },
  },
  {
    name: "insertH1ElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `h1` 要素の `id` 属性を入力してください",
      });
      insertH1ElementAtCursor(input || "");
    },
  },
  {
    name: "insertParagraphElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `p` 要素の `id` 属性を入力してください",
      });
      insertParagraphElementAtCursor(input || "");
    },
  },
];

export default htmlCommands;
