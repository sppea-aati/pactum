const fs = require('fs');
var Rx = require('rxjs');
var ops = require('rxjs/operators');

var dirPath = 'node_modules/moment/locale/';
var excludeFileName = 'pt-br.js';

var filenames = new Rx.Subject();

filenames
  .pipe(
    ops.filter((fileName) => fileName !== excludeFileName),
    ops.map((fileName) => dirPath + fileName)
  )
  .subscribe((file) => {
    fs.unlink(file, (err) => { if (err) console.log(err) });
  });

fs.readdir(dirPath, function (err, files) {
  if (err) {
    return console.log(err);
  }

  files.forEach(function (file) {
    filenames.next(file);
  });

  filenames.complete();

});
