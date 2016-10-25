
var concat = require('concat');
var chalk = require('chalk');

function getFileExtension(file) {
    return file.substr((~-file.lastIndexOf(".") >>> 0) + 2);
}

function errorHandler(error) {
    if(error) {
        throw new Error(error);
    }
}

function getDestination(output, files) {
    if(!Array.isArray(files)) errorHandler('Files should be an Array'); 
    return (output === 'all') ? output + '.' + getFileExtension(files[0]) : output;
}

function concatFiles(files, output) {
    var destination = getDestination(output, files);
    concat(files, destination, function(concatError) {
        errorHandler(concatError);
        console.log(chalk.green('Files concatenated!'));
    });
}

module.exports = {
    concatFiles: concatFiles,
    getDestination: getDestination,
    errorHandler: errorHandler,
    getFileExtension: getFileExtension
};