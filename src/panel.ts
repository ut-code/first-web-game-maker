import * as vscode from "vscode";
import { type PanelData } from "./types/panelData";
import toPanel from "./utils/toPanel";

export default function createPanel(context: vscode.ExtensionContext) {
  const panelDataList: PanelData[] = [
    {
      title: "構造",
      path: "./contents/descriptions/htmlDescription.md",
    },
    {
      title: "テスト",
      path: "./contents/descriptions/test.md",
    },
    {
      title: "すごろく",
      path: "./contents/descriptions/sugorokuDescription.md",
    },
    {
      title: "将棋",
      path: "./contents/descriptions/shogiDescription.md",
    },
  ];
  return toPanel(panelDataList, context);
}
