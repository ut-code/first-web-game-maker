import * as vscode from "vscode";
import { type Command } from "../types/command";

/**
 * toCommands
 * @param {Command[]} commands - commands
 * @returns {vscode.Disposable[]} vscode.commands
 * @description
 * toCommands is a function that converts commands to vscode.commands.
 * It is used to register commands.
 */
export default function toCommands(commands: Command[]) {
  return commands.map((command) =>
    vscode.commands.registerCommand(
      `first-web-game-maker.${command.name}`,
      command.execute
    )
  );
}
