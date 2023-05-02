import * as vscode from "vscode";

/**
 * TreeItem
 * @param label
 * @param collapsibleState
 * @param command
 * @param children
 * @returns TreeItem
 * @description
 * TreeItem is a class that represents a node in a tree view.
 * It is used to display the tree view in the sidebar.
 */
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
