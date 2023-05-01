import * as vscode from "vscode";

export class TreeItem extends vscode.TreeItem {
  children: TreeItem[];
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    children?: TreeItem[]
  ) {
    super(label, collapsibleState);
    this.children = children || [];
    this.contextValue = "treeItem";
  }
}

const treeData = [
  new TreeItem("構造", vscode.TreeItemCollapsibleState.Expanded, undefined, [
    new TreeItem("箱を挿入", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertDivElementAtCursor",
      title: "",
    }),
    new TreeItem("ボタンを挿入", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertButtonElementAtCursor",
      title: "",
    }),
    new TreeItem("入力欄を挿入", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertInputElementAtCursor",
      title: "",
    }),
    new TreeItem("リストを挿入", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertUnorderedListElementAtCursor",
      title: "",
    }),
    new TreeItem("見出しを挿入", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertH1ElementAtCursor",
      title: "",
    }),
    new TreeItem("段落を挿入", vscode.TreeItemCollapsibleState.None, {
      command: "first-web-game-maker.insertParagraphElementAtCursor",
      title: "",
    }),
  ]),
  new TreeItem("見た目", vscode.TreeItemCollapsibleState.Expanded, undefined, [
    new TreeItem("あいてむ", vscode.TreeItemCollapsibleState.None),
    new TreeItem("あいてむ", vscode.TreeItemCollapsibleState.None),
  ]),
];

export default treeData;
