import * as vscode from "vscode";
import { TreeItem } from "../../models/treeItem";

const pacmanTreeData = new TreeItem(
  "構造",
  vscode.TreeItemCollapsibleState.Expanded,
  undefined,
  [
    new TreeItem("パックマン (HTML)", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertPacmanHtmlAtTop",
      title: "",
    }),
    new TreeItem(
      "パックマン (JavaScript)",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "first-web-game-maker.insertPacmanJsAtTop",
        title: "",
      }
    ),
  ]
);

export default pacmanTreeData;
