import * as vscode from "vscode";
import { type PanelData } from "./types/panelData";
import toPanel from "./utils/toPanel";
import pwaMakerDescription from "./contents/descriptions/pwaMakerDescription";
import shogiDescription from "./contents/descriptions/shogiDescription";
import sugorokuDescription from "./contents/descriptions/sugorokuDescription";
import topPageDescription from "./contents/descriptions/topPageDescription";

export default function createPanel(context: vscode.ExtensionContext) {
  const panelDataList: PanelData[] = [
    {
      title: "使い方",
      content: topPageDescription,
    },
    {
      title: "すごろく",
      content: sugorokuDescription,
    },
    {
      title: "PWA Maker",
      content: pwaMakerDescription,
    },
    // {
    //   title: "将棋",
    //   content: shogiDescription,
    // },
  ];
  return toPanel(panelDataList, context);
}
