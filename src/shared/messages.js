import { cwd, stdout } from 'node:process';
import { MESSAGE, LOG_COLOR } from './consts.js';

export const messages = {
  sayHi: userName => {
    console.log(LOG_COLOR.YELLOW, `${MESSAGE.WELCOME}, ${userName}`);
  },

  sayBye: userName => {
    console.log(LOG_COLOR.YELLOW, `${MESSAGE.BYE}, ${userName}, goodbye!`);
    process.exit();
  },

  printCurrentDir: () => {
    console.log(LOG_COLOR.CYAN, `${MESSAGE.CURRENT_DIR} \x1b[35m${cwd()}\x1b[0m`);
    stdout.write('> ');
  },

  printMsg: msg => {
    console.log(LOG_COLOR.YELLOW, msg);
    stdout.write('> ');
  }
};
