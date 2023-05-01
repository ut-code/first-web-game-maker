import insertHelloWorldAtTopCommand from "./commands/insertHelloWorldAtTop";
import insertAtCursorCommand from "./commands/insertAtCursor";
import deleteAfterCursorCommand from "./commands/deleteAfterCursor";
import htmlCommands from "./commands/htmlCommands";

/**
 * the type of command
 * @typedef {Object} Command
 * @property {string} name - the name of command
 * @property {() => void} execute - the function to execute command
 */
export type Command = {
  name: string;
  execute: () => void;
};

const commands: Command[] = [
  insertHelloWorldAtTopCommand,
  insertAtCursorCommand,
  deleteAfterCursorCommand,
  ...htmlCommands,
];

export default commands;
