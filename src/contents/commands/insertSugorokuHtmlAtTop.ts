import * as vscode from "vscode";
import { type Command } from "../../types/command";
import sugorokuHtml from "./sugorokuTemplate/sugorokuHtml";
import sugorokuStyle from "./sugorokuTemplate/sugorokuStyle";
import sugorokuTable from "./sugorokuTemplate/sugorokuTable";
import sugorokuSettings from "./sugorokuTemplate/sugorokuSettings";
import sugorokuDiceStart from "./sugorokuTemplate/sugorokuDiceStart";
import sugorokuGetNum from "./sugorokuTemplate/sugorokuGetNum";
import sugorokuDiceReset from "./sugorokuTemplate/sugorokuDiceReset";
import sugorokuDiceNext from "./sugorokuTemplate/sugorokuDiceNext";
import sugorokuCreateBoard from "./sugorokuTemplate/sugorokuCreateBoard";
import sugorokuMovePlayer from "./sugorokuTemplate/sugorokuMovePlayer";
import sugorokuInitGame from "./sugorokuTemplate/sugorokuInitGame";
import sugorokuAppendHtml from "./sugorokuTemplate/sugorokuAppendHtml";

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

const insertSugorokuStyle = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuStyle + "\n");
  });
};

const insertSugorokuTable = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuTable + "\n");
  });
};

const insertSugorokuSettings = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuSettings + "\n");
  });
};

const insertSugorokuDiceStart = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuDiceStart + "\n");
  });
};

const insertSugorokuGetNum = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuGetNum + "\n");
  });
};

const insertSugorokuDiceReset = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuDiceReset + "\n");
  });
};

const insertSugorokuDiceNext = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuDiceNext + "\n");
  });
};

const insertSugorokuCreateBoard = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuCreateBoard + "\n");
  });
};

const insertSugorokuMovePlayer = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuMovePlayer + "\n");
  });
};

const insertSugorokuInitGame = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = activeEditor.selection.active;
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuInitGame + "\n");
  });
};

const insertSugorokuAppendAtTop = () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const position = new vscode.Position(0, 0);
  activeEditor.edit((edit) => {
    edit.insert(position, sugorokuAppendHtml + "\n");
  });
};

const insertSugorokuCommands: Command[] = [
  {
    name: "insertSugorokuAtTop",
    execute: () => {
      insertSugorokuAtTop();
    },
  },
  {
    name: "insertSugorokuStyle",
    execute: () => {
      insertSugorokuStyle();
    },
  },
  {
    name: "insertSugorokuTable",
    execute: () => {
      insertSugorokuTable();
    },
  },
  {
    name: "insertSugorokuSettings",
    execute: () => {
      insertSugorokuSettings();
    },
  },
  {
    name: "insertSugorokuDiceStart",
    execute: () => {
      insertSugorokuDiceStart();
    },
  },
  {
    name: "insertSugorokuGetNum",
    execute: () => {
      insertSugorokuGetNum();
    },
  },
  {
    name: "insertSugorokuDiceReset",
    execute: () => {
      insertSugorokuDiceReset();
    },
  },
  {
    name: "insertSugorokuDiceNext",
    execute: () => {
      insertSugorokuDiceNext();
    },
  },
  {
    name: "insertSugorokuCreateBoard",
    execute: () => {
      insertSugorokuCreateBoard();
    },
  },
  {
    name: "insertSugorokuMovePlayer",
    execute: () => {
      insertSugorokuMovePlayer();
    },
  },
  {
    name: "insertSugorokuInitGame",
    execute: () => {
      insertSugorokuInitGame();
    },
  },
  {
    name: "insertSugorokuAppendAtTop",
    execute: () => {
      insertSugorokuAppendAtTop();
    },
  },
];
export default insertSugorokuCommands;
