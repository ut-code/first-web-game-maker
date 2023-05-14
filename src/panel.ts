import * as vscode from "vscode";
import { type PanelData } from "./types/panelData";
import toPanel from "./utils/toPanel";
import shogiDescription from "./contents/descriptions/shogiDescription";
import sugorokuDescription from "./contents/descriptions/sugorokuDescription";
import topPageDescription from "./contents/descriptions/topPageDescription";
import pacmanDescription from "./contents/descriptions/pacmanDescription"

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
    // {
    //   title: "将棋",
    //   content: shogiDescription,
    // },
    {
      title: "パックマン",
      content: pacmanDescription,
    },
  ];
  return toPanel(panelDataList, context);
}
