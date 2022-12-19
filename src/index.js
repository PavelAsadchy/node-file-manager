import { stdin } from 'node:process';
import { commandController } from './controller.js';
import {
  getUserName,
  getCurrentDirecory,
  setDirectory
} from './shared/utils.js';
import { messages } from './shared/messages.js';

const fileManager = () => {
  const userName = getUserName();
  const startingDir = getCurrentDirecory();

  messages.sayHi(userName);
  setDirectory(startingDir);
  messages.printCurrentDir();

  stdin.on('data', data => commandController(data, userName));

  process.on('SIGINT', () => {
    messages.sayBye(userName);
    process.exit();
  });
};

fileManager();
