import { cwd, stdout } from 'node:process';
import { MESSAGE } from './consts.js';

export const messages = {
  sayHi: userName => {
    console.log(`${MESSAGE.WELCOME}, ${userName}`);
  },

  sayBye: userName => {
    console.log(`${MESSAGE.BYE}, ${userName}, goodbye!`);
    process.exit();
  },

  printCurrentDir: () => {
    console.log('\x1b[36m%s\x1b[0m', `${MESSAGE.CURRENT_DIR} \x1b[35m${cwd()}\x1b[0m`);
    stdout.write('> ');
  },

  printMsg: msg => {
    console.log(msg);
    stdout.write('> ');
  }
};
