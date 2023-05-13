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
        new TreeItem(
          "パックマンを描画する関数を定義",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "first-web-game-maker.insertDrawPacmanAtCursor",
            title: "",
          }
        ),
        new TreeItem(
          "パックマンを描画する関数を呼び出し",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "first-web-game-maker.insertCallDrawPacmanFuncAtCursor",
            title: "",
          }
        ),
      ]
    ),
  ]
);

export default pacmanTreeData;
