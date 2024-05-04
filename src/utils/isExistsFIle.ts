import { path as appPath } from 'app-root-path';
import { pathExists } from 'fs-extra';
import * as path from 'path';

export const isExistsFile = async (filename: string): Promise<boolean> => {
  const filePath = path.join(appPath, 'uploads', filename);

  return await pathExists(filePath);
};
