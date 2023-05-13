import * as vscode from "vscode";
import { TreeItem } from "../../models/treeItem";

const pacmanTreeData = new TreeItem(
  "パックマン",
  vscode.TreeItemCollapsibleState.Expanded,
  undefined,
  [
    new TreeItem(
      "パックマン (HTML)",
      vscode.TreeItemCollapsibleState.Expanded,
      undefined,
      [
        new TreeItem(
          "HTML のテンプレート",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "first-web-game-maker.insertHtmlTemplateAtTop",
            title: "",
          }
        ),
      ]
    ),
    new TreeItem(
      "パックマン (JavaScript)",
      vscode.TreeItemCollapsibleState.Expanded,
      undefined,
      [
        new TreeItem(
          "JavaScript のテンプレート",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "first-web-game-maker.insertWallJsAtTop",
            title: "",
          }
        ),
      ]
    ),
  ]
);

export default pacmanTreeData;
