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
        new TreeItem(
          "パックマンを動かす関数を定義",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "first-web-game-maker.insertMovePacmanAtCursor",
            title: "",
          }
        ),
        new TreeItem(
          "パックマンを動かす関数を呼び出し",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "first-web-game-maker.insertCallMovePacmanFuncAtCursor",
            title: "",
          }
        ),
        new TreeItem(
          "キー入力を受け取る関数を定義",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "first-web-game-maker.insertOnKeyDownAtCursor",
            title: "",
          }
        ),
        new TreeItem(
          "現在位置と方向を保存する変数を定義",
          vscode.TreeItemCollapsibleState.None,
          {
            command:
              "first-web-game-maker.definePacmanPositionAndNextDirectionAtCursor",
            title: "",
          }
        ),
        new TreeItem("方向に応じて進む", vscode.TreeItemCollapsibleState.None, {
          command: "first-web-game-maker.goDesignatedDirectionAtCursor",
          title: "",
        }),
      ]
    ),
  ]
);

export default pacmanTreeData;
