import * as vscode from "vscode";
import { type PanelData } from "../types/panelData";
import getFileContentFromPath from "./getFileContentFromPath";
import convertMarkdownToHtml from "./convertMarkdownToHtml";

export default function toPanel(
  panelDataList: PanelData[],
  context: vscode.ExtensionContext
) {
  const panel = vscode.window.createWebviewPanel(
    "first-web-game-maker",
    "First Web Game Maker",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
    }
  );

  const html = panelDataList
    .map(
      (panelData, index) => `<button id="${index}">${panelData.title}</button>`
    )
    .join("");
  const js = `<script>const vscode = acquireVsCodeApi();${panelDataList
    .map(
      (_, index) =>
        `document.getElementById("${index}").onclick = () => {vscode.postMessage({ type: "${index}" });};`
    )
    .join("")}</script>`;
  const header = html + js;

  panel.webview.html =
    header +
    convertMarkdownToHtml(getFileContentFromPath(panelDataList[0].path));

  panel.webview.onDidReceiveMessage(
    (message) => {
      panel.webview.html =
        header +
        convertMarkdownToHtml(
          getFileContentFromPath(panelDataList[message.type].path)
        );
    },
    undefined,
    context.subscriptions
  );

  return panel;
}
