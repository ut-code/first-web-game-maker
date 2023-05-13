import { type Command } from "./types/command";
import toCommands from "./utils/toCommands";
import insertHelloWorldAtTopCommand from "./contents/commands/insertHelloWorldAtTop";
import insertAtCursorCommand from "./contents/commands/insertAtCursor";
import deleteAfterCursorCommand from "./contents/commands/deleteAfterCursor";
import pwaMakerCommands from "./contents/commands/pwaMakerCommands";
import insertSugorokuCommands from "./contents/commands/insertSugorokuHtmlAtTop";
import insertShogiHtmlAtTopCommand from "./contents/commands/insertShogiHtmlAtTop";
import insertShogiJsAtTopCommand from "./contents/commands/insertShogiJsAtTop";

const commands: Command[] = [
  insertHelloWorldAtTopCommand,
  insertAtCursorCommand,
  deleteAfterCursorCommand,
  ...insertSugorokuCommands,
  insertShogiHtmlAtTopCommand,
  insertShogiJsAtTopCommand,
  ...pwaMakerCommands,
];

export default toCommands(commands);
