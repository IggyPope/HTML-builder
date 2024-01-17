const { createReadStream } = require('fs');
const { join } = require('path');

const filePath = join(__dirname, 'text.txt');
const readStream = createReadStream(filePath);
readStream.pipe(process.stdout);
