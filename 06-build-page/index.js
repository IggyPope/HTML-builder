const { mkdir, rm, readdir, copyFile, readFile } = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const { pipeline } = require('stream/promises');
const { join, extname } = require('path');

const config = {
  output: join(__dirname, 'project-dist'),
  html: {
    template: join(__dirname, 'template.html'),
    components: join(__dirname, 'components'),
    output: join(__dirname, 'project-dist', 'index.html'),
  },
  styles: {
    src: join(__dirname, 'styles'),
    output: join(__dirname, 'project-dist', 'style.css'),
  },
  assets: {
    src: join(__dirname, 'assets'),
    output: join(__dirname, 'project-dist', 'assets'),
  },
};

createDir(config.output).then(async () => {
  await copyDir(config.assets.src, config.assets.output);
  await bundleStyles(config.styles.src, config.styles.output);
  await bundleHTML(
    config.html.template,
    config.html.components,
    config.html.output,
  );
});

async function bundleHTML(templatePath, componentsPath, outputPath) {
  const outputStream = createWriteStream(outputPath);
  let template = String(await readFile(templatePath));

  const components = [
    ...template.matchAll(/\{\{\s*(?<name>[a-zA-Z]+)\s*\}\}/g),
  ].map((match) => {
    return {
      placeholder: match[0],
      path: join(componentsPath, `${match.groups.name}.html`),
    };
  });

  for (const component of components) {
    const componentContent = String(await readFile(component.path));
    template = template.replaceAll(component.placeholder, componentContent);
  }

  outputStream.write(template);
  outputStream.end();
}

async function createDir(dirPath) {
  try {
    await mkdir(dirPath);
  } catch (err) {
    if (err.code === 'EEXIST') {
      await rm(dirPath, { recursive: true, force: true });
      await mkdir(dirPath);
    }
  }
}

async function copyDir(srcDirPath, destDirPath) {
  await createDir(destDirPath).then(async () => {
    const dirEntries = await readdir(srcDirPath, { withFileTypes: true });

    for (const dirEntry of dirEntries) {
      const srcPath = join(srcDirPath, dirEntry.name);
      const destPath = join(destDirPath, dirEntry.name);

      dirEntry.isDirectory()
        ? copyDir(srcPath, destPath)
        : copyFile(srcPath, destPath);
    }
  });
}

async function bundleStyles(srcDirPath, destFilePath) {
  const writeStream = createWriteStream(destFilePath);

  writeStream.on('error', console.error);

  const files = await readdir(srcDirPath);
  const cssFiles = files.filter((file) => extname(file) === '.css');

  for (const cssFile of cssFiles) {
    const filePath = join(srcDirPath, cssFile);
    const readStream = createReadStream(filePath);

    await pipeline(readStream, writeStream, { end: false });
  }
}
