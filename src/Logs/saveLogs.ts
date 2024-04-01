import { stat } from 'fs';
import { appendFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { TypeLogs } from 'src/utils/constants';

let fileName = '';
let uniqueCode = new Date().valueOf();

export const saveLogs = async (
  message: string,
  type: TypeLogs,
  size: number,
) => {
  fileName = `${type}${uniqueCode}`;
  const filePath = join(__dirname, `${fileName}`);
  try {
    stat(filePath, (err, info) => {
      if (!err) {
        if (info.size > size) uniqueCode = new Date().valueOf();
      }
    });
    await appendFile(filePath, `${message}\n`);
  } catch (err) {
    try {
      await writeFile(filePath, `${new Date()}: ${message}\n`);
    } catch (err) {
      console.log(err);
    }
  }
};
