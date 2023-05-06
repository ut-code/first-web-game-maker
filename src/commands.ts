import { type Command } from "./types/command";
import toCommands from "./utils/toCommands";
import insertHelloWorldAtTopCommand from "./contents/commands/insertHelloWorldAtTop";
import insertAtCursorCommand from "./contents/commands/insertAtCursor";
import deleteAfterCursorCommand from "./contents/commands/deleteAfterCursor";
import insertPacmanHtmlAtTopCommand from "./contents/commands/insertPacmanHtmlAtTop";
import insertPacmanJsAtTopCommand from "./contents/commands/insertPacmanJsAtTop";
import htmlCommands from "./contents/commands/htmlCommands";

const commands: Command[] = [
  insertHelloWorldAtTopCommand,
  insertAtCursorCommand,
  deleteAfterCursorCommand,
  insertPacmanHtmlAtTopCommand,
  insertPacmanJsAtTopCommand,
  ...htmlCommands,
];

export default toCommands(commands);
