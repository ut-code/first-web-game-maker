import * as vscode from "vscode";
import { type Command } from "./../commands";

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

export const insertDivElementAtCursorCommand: Command = {
  name: "insertDivElementAtCursor",
  execute: async () => {
    const input = await vscode.window.showInputBox({
      prompt: "挿入する `div` 要素の `id` 属性を入力してください",
    });
    insertDivElementAtCursor(input || "");
  },
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

export const insertButtonElementAtCursorCommand: Command = {
  name: "insertButtonElementAtCursor",
  execute: async () => {
    const input = await vscode.window.showInputBox({
      prompt: "挿入する `button` 要素の `id` 属性を入力してください",
    });
    insertButtonElementAtCursor(input || "");
  },
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

export const insertInputElementAtCursorCommand: Command = {
  name: "insertInputElementAtCursor",
  execute: async () => {
    const input = await vscode.window.showInputBox({
      prompt: "挿入する `input` 要素の `id` 属性を入力してください",
    });
    insertInputElementAtCursor(input || "");
  },
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

export const insertUnorderedListElementAtCursorCommand: Command = {
  name: "insertUnorderedListElementAtCursor",
  execute: async () => {
    const input = await vscode.window.showInputBox({
      prompt: "挿入する `ul` 要素の `id` 属性を入力してください",
    });
    insertUnorderedListElementAtCursor(input || "");
  },
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

export const insertH1ElementAtCursorCommand: Command = {
  name: "insertH1ElementAtCursor",
  execute: async () => {
    const input = await vscode.window.showInputBox({
      prompt: "挿入する `h1` 要素の `id` 属性を入力してください",
    });
    insertH1ElementAtCursor(input || "");
  },
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

export const insertParagraphElementAtCursorCommand: Command = {
  name: "insertParagraphElementAtCursor",
  execute: async () => {
    const input = await vscode.window.showInputBox({
      prompt: "挿入する `p` 要素の `id` 属性を入力してください",
    });
    insertParagraphElementAtCursor(input || "");
  },
};
