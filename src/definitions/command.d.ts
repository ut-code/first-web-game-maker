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
