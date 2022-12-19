import { argv, chdir } from 'node:process';
import { homedir } from 'node:os';
import { promisify } from 'node:util';
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
    // messages.printCurrentDir();
    // console.log(`New directory: ${cwd()}`);
  } catch (err) {
    messages.printMsg(MESSAGE.OPERATION_FAILED);
  }
};

export const getReadableCommand = input =>
  input.toString().trim().split(' ')[0];

export const getArgs = input => {
  // return data.toString().trim().split(' ').slice(1);
  const argItems = input.toString().match(/\s\S*".+?"\S*|\s\S+/g);
  // console.log('Inside', argItems)
  return argItems?.map((item) => { return item.trim().replaceAll('"', '') });
};

export const handlerWrapper = async (callback, args, options) => {
  try {
    await callback(args, options);
    // await promisify(callback(args, options));
    messages.printCurrentDir();
  } catch(err) {
    messages.printMsg(err);
    // messages.printMsg(MESSAGE.OPERATION_FAILED);
  }
};
