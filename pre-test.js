/*
Just a tester script that tests to see if simple event can be caught.
Useful to know quickly of corrupted files
*/
var fs = require('fs');
var jsgo = require('jsgo');

var inputfile = process.argv[2];

fs.readFile(inputfile, function(err, data) {

process.stdout.write('starting tester')
  new jsgo.Demo().
  on('game.round_end', function(event) {
      process.stdout.write('caught event!');
      process.stdout.write('\n');
  }).parse(data);
});

