const { readdir, stat } = require('fs/promises');
const path = require('path');

(async function () {
  const folderPath = path.join(__dirname, 'secret-folder');
  const dirEntries = await readdir(folderPath, { withFileTypes: true });

  for (const dirEntry of dirEntries) {
    if (dirEntry.isDirectory()) continue;

    const filePath = path.join(folderPath, dirEntry.name);

    const fileStats = await stat(filePath);

    const fileExt = path.extname(dirEntry.name);
    const fileBaseName = path.basename(filePath, fileExt);
    const fileSize = (fileStats.size / 1024).toFixed(3) + 'kb';

    console.log([fileBaseName, fileExt, fileSize].join(' - '));
  }
})();
