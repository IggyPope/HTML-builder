const { createWriteStream } = require('fs');
const { join } = require('path');
const { stdin, stdout } = process;

const filePath = join(__dirname, 'text.txt');
const writeStream = createWriteStream(filePath);

stdout.write('Please, enter the text to be written to text.txt\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.emit('SIGINT');
    return;
  }

  writeStream.write(data);
});

process.on('SIGINT', () => {
  writeStream.close();
  stdout.write('Thank you, have a nice day!');

  process.exit(0);
});
