import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // const files = vscode.workspace.textDocuments;
  // const paths = { scriptJs: "", indexHtml: "" };

  // for (const file of files) {
  //   if (file.fileName.endsWith("script.js")) {
  //     paths.scriptJs = file.fileName;
  //   } else if (file.fileName.endsWith("index.html")) {
  //     paths.indexHtml = file.fileName;
  //   }
  // }
  // console.log(`${paths.scriptJs}, ${paths.indexHtml}`);

  // vscode.workspace.openTextDocument(paths.scriptJs);
  // vscode.workspace.openTextDocument(paths.indexHtml);

  const insertHelloWorldAtTop = () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }
    const position = new vscode.Position(0, 0);
    activeEditor.edit((edit) => {
      edit.insert(position, "Hello, World!\n");
    });
  };

  const insertAtCursor = (text: string) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }
    const position = activeEditor.selection.active;
    activeEditor.edit((edit) => {
      edit.insert(position, text);
    });
  };

  const deleteAfterCursor = (chars: number) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }
    const position = activeEditor.selection.active;
    activeEditor.edit((edit) => {
      edit.delete(
        new vscode.Range(
          position,
          new vscode.Position(position.line, position.character + chars)
        )
      );
    });
  };

  const insertDivElementAtCursor = (idName: string) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }
    const position = activeEditor.selection.active;
    activeEditor.edit((edit) => {
      edit.insert(position, `<div id="${idName}"></div>`);
    });
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "first-web-game-maker.insertHelloWorldAtTop",
      () => {
        insertHelloWorldAtTop();
      }
    ),
    vscode.commands.registerCommand(
      "first-web-game-maker.insertAtCursor",
      async () => {
        const input = await vscode.window.showInputBox({
          prompt: "挿入する文字列を入力してください",
        });
        insertAtCursor(input || "");
      }
    ),
    vscode.commands.registerCommand(
      "first-web-game-maker.deleteAfterCursor",
      async () => {
        const input = await vscode.window.showInputBox({
          prompt: "削除する文字数を入力してください",
          value: "1",
        });
        deleteAfterCursor(parseInt(input || "1"));
      }
    ),
    vscode.commands.registerCommand(
      "first-web-game-maker.insertDivElementAtCursor",
      async () => {
        const input = await vscode.window.showInputBox({
          prompt: "挿入する `div` 要素の `id` 属性を入力してください",
        });
        insertDivElementAtCursor(input || "");
      }
    )
  );

  // これはよくわかりません。
  class TreeItem extends vscode.TreeItem {
    constructor(
      public readonly label: string,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState,
      public readonly command?: vscode.Command
    ) {
      super(label, collapsibleState);
    }
  }

  // これもよくわかりません。
  class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
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

    // この中に TreeView に表示する要素を返す処理を書くらしい。
    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
      if (element) {
        return Promise.resolve([]);
      } else {
        return Promise.resolve([
          new TreeItem("箱を挿入", vscode.TreeItemCollapsibleState.None, {
            command: "first-web-game-maker.insertDivElementAtCursor",
            title: "",
          }),
        ]);
      }
    }
  }

  const treeDataProvider = new TreeDataProvider();
  const treeView = vscode.window.createTreeView("first-web-game-maker", {
    treeDataProvider,
  });
  context.subscriptions.push(treeView);
}

export function deactivate() {}
