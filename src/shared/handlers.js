import { cwd } from 'node:process';
import { createReadStream, createWriteStream } from 'node:fs';
import {
  readdir,
  readFile,
  rename,
  rm,
  writeFile
} from 'fs/promises';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import * as path from 'node:path';
import { EOL, cpus, homedir, userInfo, arch } from 'node:os';
import { createHash } from 'node:crypto';
import { MESSAGE, LOG_COLOR } from './consts.js';
import { messages } from './messages.js';
import { setDirectory } from './utils.js';
import OS_PARAMS from './osParams.enum.js';

export const handlers = {
  up: () => {
    const upPath = path.resolve('..');
    setDirectory(upPath);
  },

  cd: ([dirName]) => {
    const pathToDir = path.resolve(dirName);
    setDirectory(pathToDir);
  },

  ls: async () => {
    const dirContent = await readdir(cwd(), { withFileTypes: true });
    const output = dirContent.reduce((acc, item) => {
      item.isDirectory()
        ? acc.push({Name: item.name, Type: 'directory'})
        : acc.push({Name: item.name, Type: 'file'});

        return acc;
    }, []);

    output.sort((a, b) => {
      if (a['Type'] > b['Type']) {
        return 1;
      } else if (a['Type'] < b['Type']) {
        return -1;
      } else {
        if (a['Name'] > b['Name']) {
          return 1;
        } else if (a['Name'] < b['Name']) {
          return -1;
        }

        return 0;
      }
    });

    console.table(output);
  },

  cat: async ([fileName]) => {
    const pathToFile = path.resolve(fileName);
    const readableStream = createReadStream(pathToFile, { encoding: 'utf8' });
    readableStream.on('data', chunk => console.log(LOG_COLOR.YELLOW, chunk));
    readableStream.on('end', () => messages.printCurrentDir());
    readableStream.on('error', () => messages.printMsg(MESSAGE.OPERATION_FAILED));
  },

  add: async ([fileName]) => {
    const pathToFile = path.resolve(fileName);
    await writeFile(pathToFile, '', { flag: 'wx'});
  },

  rn: async ([fileName, newFileName]) => {
    const pathToFile = path.resolve(fileName);
    const newPathToFile = path.resolve(newFileName);
    await rename(pathToFile, newPathToFile);
  },

  cp: async ([fileName, dirName], { delete_initial } = false) => {
    const sourcePath = path.resolve(fileName);
    const targetPath = path.resolve(dirName);

    createReadStream(sourcePath, { encoding: 'utf8' }).pipe(createWriteStream(`${targetPath}/${fileName}`));

    if (delete_initial) await rm(sourcePath);
  },

  rm: async ([fileName]) => {
    const pathToFile = path.resolve(fileName);
    await rm(pathToFile);
  },

  os: ([arg]) => {
    switch (arg) {
      case OS_PARAMS.END_OF_LINE:
        console.log(LOG_COLOR.YELLOW, `${MESSAGE.DEFAULT_EOL}: ${JSON.stringify(EOL)}`);
        break;
      case OS_PARAMS.CPUS:
        const cpuParams = cpus().map(({ model, speed }) => ({ Model: model, Speed: `${speed} MHz` }));
        console.log(LOG_COLOR.YELLOW, `${MESSAGE.CPU_INFO}: ${cpuParams.length}`);
        console.table(cpuParams);
        break;
      case OS_PARAMS.HOME_DIR:
        console.log(LOG_COLOR.YELLOW, `${MESSAGE.HOME_DIR}: ${homedir()}`);
        break;
      case OS_PARAMS.USER_NAME:
        console.log(LOG_COLOR.YELLOW, `${MESSAGE.USER_NAME}: ${userInfo().username}`);
        break;
      case OS_PARAMS.ARCHITECTURE:
        console.log(LOG_COLOR.YELLOW, `${MESSAGE.ARHITECTURE}: ${arch()}`);
        break;
      default:
        messages.printMsg(MESSAGE.INVALID_INPUT);
    }
  },

  hash: async ([fileName]) => {
    const pathToFile = path.resolve(fileName);
    const content = await readFile(pathToFile, { encoding: 'utf8' });
    const hash = await createHash('sha256').update(content).digest('hex');
    console.log(LOG_COLOR.YELLOW, hash);
  },

  compress: async ([fileName, dirName]) => {
    const pathToFileRead = path.resolve(fileName);
    const pathToFileWrite = path.resolve(dirName);
    const read = createReadStream(pathToFileRead);
    const write = createWriteStream(
      path.join(pathToFileWrite, path.basename(fileName) + '.br')
    );
    const brotliCompress = createBrotliCompress();
    const pipe = promisify(pipeline);

    await pipe(read, brotliCompress, write);
  },

  decompress: async ([fileName, dirName]) => {
    const pathToFileRead = path.resolve(fileName);
    const pathToFileWrite = path.resolve(dirName);
    const read = createReadStream(pathToFileRead);
    const write = createWriteStream(
      path.join(pathToFileWrite, path.basename(fileName).replace('.br', ''))
    );
    const brotliDecompress = createBrotliDecompress();
    const pipe = promisify(pipeline);

    await pipe(read, brotliDecompress, write);
  },
};