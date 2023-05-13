// import * as vscode from "vscode";
// import { type Command } from "../../types/command";
// import pacmanHtml from "./pacmanTemplate/pacmanHtml";

// const insertPacmanHtmlAtTop = () => {
//   const activeEditor = vscode.window.activeTextEditor;
//   if (!activeEditor) {
//     return;
//   }
//   const position = new vscode.Position(0, 0);
//   activeEditor.edit((edit) => {
//     edit.insert(position, pacmanHtml + "\n");
//   });
// };

// const insertPacmanHtmlAtTopCommand: Command = {
//   name: "insertPacmanHtmlAtTop",
//   execute: () => {
//     insertPacmanHtmlAtTop();
//   },
// };

// export default insertPacmanHtmlAtTopCommand;
