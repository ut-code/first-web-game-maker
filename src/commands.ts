import * as vscode from "vscode";
import insertHelloWorldAtTop from "./commands/insertHelloWorldAtTop";
import insertAtCursor from "./commands/insertAtCursor";
import deleteAfterCursor from "./commands/deleteAfterCursor";
import {
  insertDivElementAtCursor,
  insertButtonElementAtCursor,
  insertInputElementAtCursor,
  insertUnorderedListElementAtCursor,
  insertH1ElementAtCursor,
  insertParagraphElementAtCursor,
} from "./commands/htmlCommands";

type Command = {
  name: string;
  execute: () => void;
};

const commands: Command[] = [
  {
    name: "insertHelloWorldAtTop",
    execute: () => {
      insertHelloWorldAtTop();
    },
  },
  {
    name: "insertAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する文字列を入力してください",
      });
      insertAtCursor(input || "");
    },
  },
  {
    name: "deleteAfterCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "削除する文字数を入力してください",
        value: "1",
      });
      deleteAfterCursor(parseInt(input || "1"));
    },
  },
  {
    name: "insertDivElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `div` 要素の `id` 属性を入力してください",
      });
      insertDivElementAtCursor(input || "");
    },
  },
  {
    name: "insertButtonElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `button` 要素の `id` 属性を入力してください",
      });
      insertButtonElementAtCursor(input || "");
    },
  },
  {
    name: "insertInputElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `input` 要素の `id` 属性を入力してください",
      });
      insertInputElementAtCursor(input || "");
    },
  },
  {
    name: "insertUnorderedListElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `ul` 要素の `id` 属性を入力してください",
      });
      insertUnorderedListElementAtCursor(input || "");
    },
  },
  {
    name: "insertH1ElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `h1` 要素の `id` 属性を入力してください",
      });
      insertH1ElementAtCursor(input || "");
    },
  },
  {
    name: "insertParagraphElementAtCursor",
    execute: async () => {
      const input = await vscode.window.showInputBox({
        prompt: "挿入する `p` 要素の `id` 属性を入力してください",
      });
      insertParagraphElementAtCursor(input || "");
    },
  },
];

export default commands;
