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
