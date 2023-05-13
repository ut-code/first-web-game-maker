// import * as vscode from "vscode";
// import { type Command } from "../../types/command";
// import pacmanJs from "./pacmanTemplate/pacmanJs";

// const insertPacmanJsAtTop = () => {
//   const activeEditor = vscode.window.activeTextEditor;
//   if (!activeEditor) {
//     return;
//   }
//   const position = new vscode.Position(0, 0);
//   activeEditor.edit((edit) => {
//     edit.insert(position, pacmanJs + "\n");
//   });
// };

// const insertPacmanJsAtTopCommand: Command = {
//   name: "insertPacmanJsAtTop",
//   execute: () => {
//     insertPacmanJsAtTop();
//   },
// };

// export default insertPacmanJsAtTopCommand;
