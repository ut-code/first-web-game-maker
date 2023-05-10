import { type Command } from "./types/command";
import toCommands from "./utils/toCommands";
import insertHelloWorldAtTopCommand from "./contents/commands/insertHelloWorldAtTop";
import insertAtCursorCommand from "./contents/commands/insertAtCursor";
import deleteAfterCursorCommand from "./contents/commands/deleteAfterCursor";
import htmlCommands from "./contents/commands/htmlCommands";
import insertSugorokuHtmlAtTopCommand from "./contents/commands/insertSugorokuHtmlAtTop";

const commands: Command[] = [
  insertHelloWorldAtTopCommand,
  insertAtCursorCommand,
  deleteAfterCursorCommand,
  insertSugorokuHtmlAtTopCommand,
  ...htmlCommands,
];

export default toCommands(commands);
