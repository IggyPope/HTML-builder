const { readdir } = require('fs/promises');
const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');
const { join, extname } = require('path');

const srcDirPath = join(__dirname, 'styles');
const destFilePath = join(__dirname, 'project-dist', 'bundle.css');

mergeStyles(srcDirPath, destFilePath);

async function mergeStyles(srcDirPath, destFilePath) {
  const writeStream = createWriteStream(destFilePath);

  writeStream.on('error', console.error);

  const files = await readdir(srcDirPath);
  const cssFiles = files.filter((file) => extname(file) === '.css');

  for (const cssFile of cssFiles) {
    const filePath = join(srcDirPath, cssFile);
    const readStream = createReadStream(filePath);

    readStream.on('end', () => {
      writeStream.write('\n');
    });

    await pipeline(readStream, writeStream, { end: false });
  }
}
