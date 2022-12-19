import { stdin } from 'node:process';
import COMMAND from './shared/command.enum.js';
import { MESSAGE } from './shared/consts.js';
import { handlers } from './shared/handlers.js';
import { messages } from './shared/messages.js';
import {
  handlerWrapper,
  getArgs,
  getReadableCommand
} from './shared/utils.js';

export const commandController = async (commandInput, userName) => {
  stdin.pause();

  try {
    const command = getReadableCommand(commandInput);
    const args = getArgs(commandInput);

    switch (command) {
      case COMMAND.UP:
        handlerWrapper(handlers.up);
        break;
      case COMMAND.CHANGE_DIR:
        handlerWrapper(handlers.cd, args);
        break;
      case COMMAND.LIST:
        handlerWrapper(handlers.ls);
        break;
      case COMMAND.PRINT_FILE_CONTENT:
        await handlers.cat(args);
        break;
      case COMMAND.ADD:
        handlerWrapper(handlers.add, args);
        break;
      case COMMAND.RENAME_FILE:
        handlerWrapper(handlers.rn, args);
        break;
      case COMMAND.COPY_FILE:
        handlerWrapper(handlers.cp, args);
        break;
      case COMMAND.MOVE_FILE:
        handlerWrapper(handlers.cp, args, { delete_initial: true });
        break;
      case COMMAND.DELETE_FILE:
        handlerWrapper(handlers.rm, args);
        break;
      case COMMAND.PRINT_OS_INFO:
        handlerWrapper(handlers.os, args);
        break;
      case COMMAND.HASH:
        handlerWrapper(handlers.hash, args);
        break;
      case COMMAND.COMPRESS:
        handlerWrapper(handlers.compress, args);
        break;
      case COMMAND.DECOMPRESS:
        handlerWrapper(handlers.decompress, args);
        break;
      case COMMAND.EXIT:
        messages.sayBye(userName);
        break;
      default:
        messages.printMsg(MESSAGE.INVALID_INPUT);
        break;
    }
  } catch {
    messages.printMsg(MESSAGE.OPERATION_FAILED);
  }

  stdin.resume();
};
