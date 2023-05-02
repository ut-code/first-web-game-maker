# First Web Game Maker

使い方の説明を Markdown で書けます！

**太字**はこんな感じで書けます。

~~取り消し線~~も書けます。

コードブロックはこんな感じで書けます。なんと、シンタックスハイライトもできます！

\`\`\`js
document.write("Hello, World!");
\`\`\`

HTML もこんな感じでかけます。このボタンは、Webview から VS Code にメッセージを送るサンプルです。ボタンを押すと、VS Code のウィンドウにメッセージが表示されます。

<button id="alert">alert</button>

<script>
  const vscode = acquireVsCodeApi();
  document.getElementById("alert").onclick = () =>{
    vscode.postMessage({type: "alert", message: "Hello, World!"});
  }
</script>
