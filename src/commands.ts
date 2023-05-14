import { type Command } from "./types/command";
import toCommands from "./utils/toCommands";
import insertHelloWorldAtTopCommand from "./contents/commands/insertHelloWorldAtTop";
import insertAtCursorCommand from "./contents/commands/insertAtCursor";
import deleteAfterCursorCommand from "./contents/commands/deleteAfterCursor";
import pacmanCommands from "./contents/commands/pacmanCommands";
import insertSugorokuCommands from "./contents/commands/insertSugorokuHtmlAtTop";
import insertShogiHtmlAtTopCommand from "./contents/commands/insertShogiHtmlAtTop";
import insertShogiScriptJsAtTopCommand from "./contents/commands/insertShogiScriptJsAtTop";
import shogiCommands from "./contents/commands/shogiCommands";
import insertShogiCustomShogiJsAtTopCommand from "./contents/commands/insertShogiCustomShogiJsAtTop";

const commands: Command[] = [
  insertHelloWorldAtTopCommand,
  insertAtCursorCommand,
  deleteAfterCursorCommand,

  ...pacmanCommands,
  ...insertSugorokuCommands,
  insertShogiHtmlAtTopCommand,
  insertShogiScriptJsAtTopCommand,
  insertShogiCustomShogiJsAtTopCommand,
  ...shogiCommands,
];

export default toCommands(commands);
