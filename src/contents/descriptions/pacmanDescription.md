# パックマンを作ってみよう！

パックマンは現在のバンダイナムコエンターテインメントから発売された古き良きゲームです。

今回はパックマン風のゲームを作ってみましょう。

## ファイルの準備

1. `index.html`という名前のファイルを作成します。

2. `index.html` を開いたら、左の「パックマン」→「パックマン (HTML)」のメニューから「HTML のテンプレート」のボタンを押し、保存してください。

3. `script.js` という名前のファイルを作成します。

4. `script.js` を開いたら、左の「パックマン」→「パックマン (JavaScript)」のメニューから「JavaScript のテンプレート」のボタンを押し、保存してください。

## 壁を描画する

1. `index.html` をブラウザで開いてみてください。迷路が表示されていますね。

2. 壁や通路の色を変えてみましょう。

   - (ヒント) 壁の紺色 (navy) や、通路の黒色 (black) はプログラムのどこに相当するでしょうか？

3. 迷路の形を変えてみましょう。

   - (ヒント) 最初に示されている配列の `x` と `o` はそれぞれ何を示しているでしょうか？

## パックマンを描画する

1. `script.js` を開いて、適当な空行にカーソルを置き、「パックマンを描画する関数を定義」を押しましょう。

2. 続いて、すでに入力されている `drawMazeState()` の下の行にカーソルを移動し、「パックマンを描画する関数を呼び出し」を押しましょう。

   - x 座標、y 座標はともに 75 などとしておきましょう。

パックマン (黄色い円) が表示されましたか？

## パックマンを動かす (1)

キャンバス (現在の例でいう、迷路が描画されている空間) 上でパックマンを動かすには、パラパラマンガのように、キャンバス全体を毎度描画し直す必要があります。

すなわち、

- `drawContext()`
- `drawMazeState()`
- `drawPacman()`

を毎回 (例えば 0.01 秒ごとなどに) 呼び出す必要があります。

1. `script.js` を開いて、適当な空行にカーソルを移動し、「パックマンを動かす関数を定義」を押しましょう。

2. すでに入力されている 3 つの関数呼び出し
   - `drawContext()`
   - `drawMazeState()`
   - `drawPacman()`

の部分をカットして、1. で入力された `movePacman` の関数定義の中の、

```javascript
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

と

```javascript
setTimeout(() => {
  movePacman();
}, 10);
```

の間の部分にペーストしましょう。

3. 適当な空行で「パックマンを動かす関数を呼び出し」を押し、`movePacman` という関数を呼び出しましょう。

## パックマンを動かす (2)

1.  パックマンを動かすために、矢印キーの入力を受け取る必要があります。

    a. `movePacman()` の下などに `document.onkeydown = onKeyDown;` と入力します。

    b.

    ```javascript
    function movePacman() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setTimeout(() => {
        movePacman();
      }, 10);
    }
    ```

    の下などにカーソルを移動し、「キー入力を受け取る関数を定義」を押すことで、`onKeyDown` という関数を定義します。

2.  ```javascript
    const ctx = canvas.getContext("2d");
    // ************************************************
    ```

    の下にカーソルを移動し、「現在位置と方向を保存する変数を定義」を押します。

3.  `drawPacman(75, 75)` を `drawPacman(pacmanPositionX, pacmanPositionY);` と書き換え、`pacmanPositionX`, `pacmanPositionY` の変化に応じてパックマンが描画される位置が動くようにします。

4.  `movePacman` の定義の中の

    ```javascript
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ```

    の下にカーソルを置き、「方向に応じて進む」のボタンを押します。

`index.html` をブラウザで開き、矢印キーを押してみましょう。パックマンが動きましたか？
