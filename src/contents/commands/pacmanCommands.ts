import * as vscode from "vscode";
import { type Command } from "../../types/command";
import * as path from "path";
import * as fs from "fs";

import templateHtmlAll from "./pacmanTemplate/templateHtmlAll";
import templateJsAll from "./pacmanTemplate/templateJsAll";

import htmlTemplate from "./pacmanTemplate/htmlTemplate";
import wall from "./pacmanTemplate/wall";
import pacmanHtml from "./pacmanTemplate/pacmanHtml";
import pacmanJs from "./pacmanTemplate/pacmanJs";
import drawPacman from "./pacmanTemplate/drawPacman";
import movePacman from "./pacmanTemplate/movePacman";
import {
  onKeyDown,
  goDesignatedDirection,
  definePacmanPositionAndNextDirection,
} from "./pacmanTemplate/movePacmanArrow";
import {
  pacmanNorth,
  pacmanSouth,
  pacmanEast,
  pacmanWest,
  ghostEast,
  ghostNorth,
  ghostSouth,
  ghostWest,
} from "./pacmanTemplate/pacmanImages";

const insertTemplateHtmlAllAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, templateHtmlAll + "\n");
  });
};

const insertTemplateJsAllAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, templateJsAll + "\n");
  });
};

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

const insertDrawPacmanAtCursor = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, drawPacman + "\n");
  });
};

const insertCallDrawPacmanFuncAtCursor = (x: string, y: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `drawPacman(${x}, ${y})` + "\n");
  });
};

const insertMovePacmanAtCursor = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, movePacman + "\n");
  });
};

const insertCallMovePacmanFuncAtCursor = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, `movePacman()` + "\n");
  });
};

const insertOnKeyDownAtCursor = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, onKeyDown + "\n");
  });
};

const goDesignatedDirectionAtCursor = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, goDesignatedDirection + "\n");
  });
};

const definePacmanPositionAndNextDirectionAtCursor = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, definePacmanPositionAndNextDirection + "\n");
  });
};

const loadPacmanImage = () => {
  const images = [
    pacmanEast,
    pacmanNorth,
    pacmanSouth,
    pacmanWest,
    ghostEast,
    ghostNorth,
    ghostSouth,
    ghostWest,
  ];
  const names = [
    "pacmanEast",
    "pacmanNorth",
    "pacmanSouth",
    "pacmanWest",
    "ghostEast",
    "ghostNorth",
    "ghostSouth",
    "ghostWest",
  ];
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    const workspacePath = workspaceFolders[0].uri.fsPath;
    for (let i = 0; i < images.length; i++) {
      fs.writeFileSync(
        path.join(workspacePath, `${names[i]}.svg`),
        images[i],
        "utf-8"
      );
    }
  } else {
    console.error("No workspace folder found!");
  }
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
  {
    name: "insertDrawPacmanAtCursor",
    execute: () => {
      insertDrawPacmanAtCursor();
    },
  },
  {
    name: "insertCallDrawPacmanFuncAtCursor",
    execute: async () => {
      const inputX = await vscode.window.showInputBox({
        prompt: "x 座標を半角数字で入力してください。",
      });
      const inputY = await vscode.window.showInputBox({
        prompt: "y 座標を半角数字で入力してください。",
      });
      insertCallDrawPacmanFuncAtCursor(inputX || "", inputY || "");
    },
  },
  {
    name: "insertMovePacmanAtCursor",
    execute: () => {
      insertMovePacmanAtCursor();
    },
  },
  {
    name: "insertCallMovePacmanFuncAtCursor",
    execute: () => {
      insertCallMovePacmanFuncAtCursor();
    },
  },
  {
    name: "insertOnKeyDownAtCursor",
    execute: () => {
      insertOnKeyDownAtCursor();
    },
  },
  {
    name: "goDesignatedDirectionAtCursor",
    execute: () => {
      goDesignatedDirectionAtCursor();
    },
  },
  {
    name: "definePacmanPositionAndNextDirectionAtCursor",
    execute: () => {
      definePacmanPositionAndNextDirectionAtCursor();
    },
  },
  {
    name: "insertTemplateHtmlAllAtTop",
    execute: () => {
      insertTemplateHtmlAllAtTop();
    },
  },
  {
    name: "insertTemplateJsAllAtTop",
    execute: () => {
      insertTemplateJsAllAtTop();
    },
  },
  {
    name: "loadPacmanImage",
    execute: () => {
      loadPacmanImage();
    },
  },
];

export default pacmanCommands;
