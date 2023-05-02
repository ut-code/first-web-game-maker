import { type Command } from "./types/command";
import toCommands from "./utils/toCommands";
import insertHelloWorldAtTopCommand from "./commands/insertHelloWorldAtTop";
import insertAtCursorCommand from "./commands/insertAtCursor";
import deleteAfterCursorCommand from "./commands/deleteAfterCursor";
import htmlCommands from "./commands/htmlCommands";

const commands: Command[] = [
  insertHelloWorldAtTopCommand,
  insertAtCursorCommand,
  deleteAfterCursorCommand,
  ...htmlCommands,
];

export default toCommands(commands);
