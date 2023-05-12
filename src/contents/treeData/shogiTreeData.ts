import * as vscode from "vscode";
import { TreeItem } from "../../models/treeItem";

const shogiTreeData = new TreeItem(
  "将棋",
  vscode.TreeItemCollapsibleState.Expanded,
  undefined,
  [
    new TreeItem("将棋 (HTML)", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertShogiHtmlAtTop",
      title: "",
    }),
    new TreeItem("将棋 (JavaScript)", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertShogiJsAtTop",
      title: "",
    }),
    new TreeItem("駒", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertShogiPieceTemplate",
      title: "",
    }),
  ]
);

export default shogiTreeData;
