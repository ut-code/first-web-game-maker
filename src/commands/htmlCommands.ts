import * as vscode from "vscode";

export const insertDivElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<div id="${idName}"></div>`);
  });
};

export const insertButtonElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<button id="${idName}">ボタン</button>`);
  });
};

export const insertInputElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<input id="${idName}" />`);
  });
};

export const insertUnorderedListElementAtCursor = (idName: string) => {
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

export const insertH1ElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<h1 id="${idName}">見出し</h1>`);
  });
};

export const insertParagraphElementAtCursor = (idName: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `<p id="${idName}">段落</p>`);
  });
};
