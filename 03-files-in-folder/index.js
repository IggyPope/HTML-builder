const { readdir, stat } = require('fs/promises');
const { join, extname, basename } = require('path');

(async function () {
  const folderPath = join(__dirname, 'secret-folder');
  const dirEntries = await readdir(folderPath, { withFileTypes: true });

  for (const dirEntry of dirEntries) {
    if (dirEntry.isDirectory()) continue;

    const filePath = join(folderPath, dirEntry.name);

    const fileStats = await stat(filePath);

    const fileExt = extname(dirEntry.name);
    const fileBaseName = basename(filePath, fileExt);
    const fileSize = (fileStats.size / 1024).toFixed(3) + 'kb';

    console.log([fileBaseName, fileExt.replace('.', ''), fileSize].join(' - '));
  }
})();
