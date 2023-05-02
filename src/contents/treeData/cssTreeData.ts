import * as vscode from "vscode";
import { TreeItem } from "../../models/treeItem";

const cssTreeData = new TreeItem(
  "見た目",
  vscode.TreeItemCollapsibleState.Expanded,
  undefined,
  [
    new TreeItem("あいてむ", vscode.TreeItemCollapsibleState.None),
    new TreeItem("あいてむ", vscode.TreeItemCollapsibleState.None),
  ]
);

export default cssTreeData;
