import * as vscode from "vscode";
import { TreeItem } from "../../models/treeItem";

const sugorokuTreeData = new TreeItem(
  "すごろく",
  vscode.TreeItemCollapsibleState.Expanded,
  undefined,
  [
    new TreeItem("すごろく", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuAtTop",
      title: "",
    }),
    new TreeItem("style", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuStyle",
      title: "",
    }),
    new TreeItem("table", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuTable",
      title: "",
    }),
    new TreeItem("settings", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuSettings",
      title: "",
    }),
    new TreeItem("diceStart", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuDiceStart",
      title: "",
    }),
    new TreeItem("getNum", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuGetNum",
      title: "",
    }),
    new TreeItem("diceReset", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuDiceReset",
      title: "",
    }),
    new TreeItem("diceNext", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuDiceNext",
      title: "",
    }),
    new TreeItem("createBoard", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuCreateBoard",
      title: "",
    }),
    new TreeItem("movePlayer", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuMovePlayer",
      title: "",
    }),
    new TreeItem("initGame", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertSugorokuInitGame",
      title: "",
    }),
  ]
);

export default sugorokuTreeData;
