import { argv, chdir } from 'node:process';
import { homedir } from 'node:os';
import { MESSAGE, USERNAME_ARG } from './consts.js';
import { messages } from './messages.js';

export const getUserName = () => {
  return argv
    .slice(2)
    .find(arg => arg.startsWith(USERNAME_ARG))
    .split('=')[1];
};

export const getCurrentDirecory = () => homedir();

export const setDirectory = newDir => {
  try {
    chdir(newDir);
  } catch (err) {
    messages.printMsg(MESSAGE.OPERATION_FAILED);
  }
};

export const getReadableCommand = input =>
  input.toString().trim().split(' ')[0];

export const getArgs = input => {
  const argItems = input.toString().match(/\s\S*".+?"\S*|\s\S+/g);
  return argItems?.map(item => item.trim().replaceAll('"', ''));
};

export const handlerWrapper = async (callback, args, options) => {
  try {
    await callback(args, options);
    messages.printCurrentDir();
  } catch(err) {
    messages.printMsg(err);
  }
};
