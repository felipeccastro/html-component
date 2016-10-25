var concatFunctions = require('./../concatFunctions');

var expect = require('chai').expect;
var sinon = require('sinon');
var fs = require('fs');
var path = require('path');

describe('The concatFunctions module', function() {
	beforeEach(function() {
        sinon.spy(console, 'log');
    });
    afterEach(function() {
        console.log.restore();
    });
    it('should expose an errorHandler method that will throw any error provided', function() {
    	var error = 'this is an error';
    	expect(function() { concatFunctions.errorHandler(error) }).to.throw(Error, /this is an error/);
    });
    it('should expose an getFileExtension method that returns the file extension of a file name', function() {
        var fileNameCSS = 'file.css';
        var fileNameJS = 'file.js';
        var gitignore = '.gitignore';
        expect(concatFunctions.getFileExtension(fileNameCSS)).to.equal('css');
        expect(concatFunctions.getFileExtension(fileNameJS)).to.equal('js');
        expect(concatFunctions.getFileExtension(gitignore)).to.equal('');
    });
    it('should expose an getDestination method that returns the output file string', function() {
    	var dest = 'bundle.js';
    	var files = ['file.js'];
        expect(concatFunctions.getDestination('all', files)).to.equal('all.js');
        expect(concatFunctions.getDestination(dest, files)).to.equal(dest);
        expect(function() { concatFunctions.getDestination('all', '') }).to.throw(Error);
    });
    it('should expose an concatFiles method that concatenates the files passed to it', function(done) {
    	var dest = 'bundle.js';
    	var files = ['file.js'];
    	var filesCSS = [path.join(__dirname, '/files/a.css'), 
    	                path.join(__dirname, '/files/b.css'), 
    	                path.join(__dirname, '/files/c.css')];
    	var destCSS = path.join(__dirname, '/dest/bundle.css');
    	
        if (fs.existsSync(destCSS)) {
            fs.unlinkSync(destCSS);
        }
    	concatFunctions.concatFiles(filesCSS, destCSS);
    	setTimeout(function() {
    		var calledArgs = console.log.getCall(0).args[0];
    	    var condition = calledArgs.indexOf('Files concatenated!') > -1;
            expect(function() { concatFunctions.concatFiles('', 'all') }).to.throw(Error);
            expect(condition).to.equal(true);
            done();
    	}, 400);
    });
});