const { mkdir, rm, readdir, copyFile } = require('fs/promises');
const path = require('path');

async function copyDir(srcDirName, destDirName) {
  const srcDirPath = path.join(__dirname, srcDirName);
  const destDirPath = path.join(__dirname, destDirName);

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
      const srcFilePath = path.join(srcDirPath, file);
      const destFilePath = path.join(destDirPath, file);

      copyFile(srcFilePath, destFilePath);
    }
  }
}

copyDir('files', 'files-copy');
