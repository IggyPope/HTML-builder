const { mkdir, rm, readdir, copyFile } = require('fs/promises');
const { join } = require('path');

async function copyDir(srcDirName, destDirName) {
  const srcDirPath = join(__dirname, srcDirName);
  const destDirPath = join(__dirname, destDirName);

  try {
    await mkdir(destDirPath);
  } catch (err) {
    if (err.code === 'EEXIST') {
      await rm(destDirPath, { recursive: true, force: true });
      await mkdir(destDirPath);
    }
  } finally {
    const files = await readdir(srcDirPath);

    for (const file of files) {
      const srcFilePath = join(srcDirPath, file);
      const destFilePath = join(destDirPath, file);

      copyFile(srcFilePath, destFilePath);
    }
  }
}

copyDir('files', 'files-copy');
