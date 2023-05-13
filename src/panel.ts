import * as vscode from "vscode";
import { type PanelData } from "./types/panelData";
import toPanel from "./utils/toPanel";
import htmlDescription from "./contents/descriptions/htmlDescription";
import shogiDescription from "./contents/descriptions/shogiDescription";
import sugorokuDescription from "./contents/descriptions/sugorokuDescription";
import topPageDescription from "./contents/descriptions/topPageDescription";

export default function createPanel(context: vscode.ExtensionContext) {
  const panelDataList: PanelData[] = [
    {
      title: "使い方",
      content: topPageDescription,
    },
    // {
    //   title: "構造",
    //   content: htmlDescription,
    // },
    {
      title: "すごろく",
      content: sugorokuDescription,
    },
    // {
    //   title: "将棋",
    //   content: shogiDescription,
    // },
  ];
  return toPanel(panelDataList, context);
}
