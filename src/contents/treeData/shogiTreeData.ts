import * as vscode from "vscode";
import { TreeItem } from "../../models/treeItem";

const shogiTreeData = new TreeItem(
  "将棋",
  vscode.TreeItemCollapsibleState.Expanded,
  undefined,
  [
    new TreeItem("index.html", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertShogiHtmlAtTop",
      title: "",
    }),
    new TreeItem("script.js", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertShogiScriptJsAtTop",
      title: "",
    }),
    new TreeItem("customshogi.js", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertShogiCustomShogiJsAtTop",
      title: "",
    }),
    new TreeItem("基本設定テンプレート", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertShogiConfigTemplate",
      title: "",
    }),
    new TreeItem(
      "見た目の設定テンプレート",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "first-web-game-maker.insertShogiStyleTemplate",
        title: "",
      }
    ),
    new TreeItem("駒の種類テンプレート", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertShogiPieceTemplate",
      title: "",
    }),
    new TreeItem(
      "駒の初期配置テンプレート",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "first-web-game-maker.insertShogiInitialPieceTemplate",
        title: "",
      }
    ),
  ]
);

export default shogiTreeData;
