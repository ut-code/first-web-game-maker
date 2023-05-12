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
  ]
);

export default sugorokuTreeData;
