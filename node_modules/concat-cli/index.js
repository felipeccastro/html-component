#!/usr/bin/env node

var exampleTxt = 'This will concatenate all the js files in the current directory into a bundle.js';
var argv = require('yargs')
    .option('f', {
        alias: 'files',
        demand: true,
        array: true,
        describe: 'files or glob/wildcard to be matched and concatenated',
        type: 'string'
    })
    .option('o', {
        alias: 'output',
        default: 'all',
        describe: 'the resulting file of the concatenation',
        type: 'string'
    })
    .usage('$0 concat-cli -f string -o string')
    .example('concat-cli -f *.js -o bundle.js', exampleTxt)
    .help('help')
    .argv;

var concatFunctions = require('./concatFunctions');

concatFunctions.concatFiles(argv.f, argv.o);
