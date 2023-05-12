import { type Command } from "./types/command";
import toCommands from "./utils/toCommands";
import insertHelloWorldAtTopCommand from "./contents/commands/insertHelloWorldAtTop";
import insertAtCursorCommand from "./contents/commands/insertAtCursor";
import deleteAfterCursorCommand from "./contents/commands/deleteAfterCursor";
import htmlCommands from "./contents/commands/htmlCommands";
import insertSugorokuHtmlAtTopCommand from "./contents/commands/insertSugorokuHtmlAtTop";
import insertShogiHtmlAtTopCommand from "./contents/commands/insertShogiHtmlAtTop";
import insertShogiJsAtTopCommand from "./contents/commands/insertShogiJsAtTop";
import shogiCommands from "./contents/commands/shogiCommands";

const commands: Command[] = [
  insertHelloWorldAtTopCommand,
  insertAtCursorCommand,
  deleteAfterCursorCommand,
  insertSugorokuHtmlAtTopCommand,
  insertShogiHtmlAtTopCommand,
  insertShogiJsAtTopCommand,
  ...htmlCommands,
  ...shogiCommands,
];

export default toCommands(commands);
