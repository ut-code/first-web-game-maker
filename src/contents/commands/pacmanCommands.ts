import * as vscode from "vscode";
import { type Command } from "../../types/command";
import htmlTemplate from "./pacmanTemplate/htmlTemplate";
import wall from "./pacmanTemplate/wall";
import pacmanHtml from "./pacmanTemplate/pacmanHtml";
import pacmanJs from "./pacmanTemplate/pacmanJs";

const insertWallJsAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, wall + "\n");
  });
};

const insertHtmlTemplateAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, htmlTemplate + "\n");
  });
};

const insertJsWallTemplateAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, wall + "\n");
  });
};

const insertPacmanHtmlAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, pacmanHtml + "\n");
  });
};

const insertPacmanJsAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, pacmanJs + "\n");
  });
};

const pacmanCommands: Command[] = [
  {
    name: "insertWallJsAtTop",
    execute: () => {
      insertWallJsAtTop();
    },
  },
  {
    name: "insertJsWallTemplateAtToop",
    execute: () => {
      insertJsWallTemplateAtTop();
    },
  },
  {
    name: "insertHtmlTemplateAtTop",
    execute: () => {
      insertHtmlTemplateAtTop();
    },
  },
  {
    name: "insertPacmanHtmlAtTop",
    execute: () => {
      insertPacmanHtmlAtTop();
    },
  },
  {
    name: "insertPacmanJsAtTop",
    execute: () => {
      insertPacmanJsAtTop();
    },
  },
];

export default pacmanCommands;
