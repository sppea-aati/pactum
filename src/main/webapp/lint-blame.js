const { exec } = require('child_process');
const chalk = require('chalk');

exec('ng lint', (err, stdout, stderr) => {
  const lines = stdout.split(/\r?\n/);
  for(let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('ERROR: ')) {
      const parts = line.split(': ');

      const fileAndLine = parts[1];
      const error = parts[2];

      const match = /\[(.*?)\]/g.exec(fileAndLine);

      if (match) {
        const linhaColuna = match[1];
        const linha = linhaColuna.split(',')[0];

        const file = fileAndLine.substr(0, fileAndLine.indexOf('['));

        const gitBlame = 'git blame -L ' + linha + ',' + linha + ' -- ' + file;

        exec(gitBlame, (err2, stdout2, stderr2) => {

          const gitLog = stdout2.split(/\r?\n/)[0];
          const first = gitLog.indexOf('(') + 1;
          const last = /(\d+)(-)(\d+)(-)(\d+)/g.exec(gitLog).index;
          const autor = gitLog.substr(first, last - first - 1);

          console.log(file + ':' + linha + ' ' + error + ' - ' + chalk.red(autor))
        });
        // process.exit();
      }
    }
  }
});
