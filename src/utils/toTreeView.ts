import * as vscode from "vscode";
import { TreeItem } from "./../definitions/treeItem";

export default function toTreeView(treeData: TreeItem[]) {
  class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    private data: TreeItem[];

    constructor() {
      this.data = treeData;
    }

    private _onDidChangeTreeData: vscode.EventEmitter<
      TreeItem | undefined | void
    > = new vscode.EventEmitter<TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | void> =
      this._onDidChangeTreeData.event;

    refresh(): void {
      this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
      return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
      if (element) {
        return Promise.resolve(element.children);
      } else {
        return Promise.resolve(this.data);
      }
    }
  }

  const treeDataProvider = new TreeDataProvider();
  const treeView = vscode.window.createTreeView("first-web-game-maker", {
    treeDataProvider,
  });
  return treeView;
}
