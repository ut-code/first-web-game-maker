import * as vscode from "vscode";

const deleteAfterCursor = (chars: number) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.delete(
      new vscode.Range(
        position,
        new vscode.Position(position.line, position.character + chars)
      )
    );
  });
};

export default deleteAfterCursor;
