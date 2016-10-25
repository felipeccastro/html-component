var child_process = require('child_process');
var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var destCSS = path.join(__dirname, '/dest/bundle.css');
var filesCSS = [path.join(__dirname, '/files/a.css'), 
                path.join(__dirname, '/files/b.css'),
                path.join(__dirname, '/files/c.css')];

describe('concat-cli module', function() {
    it('should concatenate files when provided with the correct arguments', function(done) {
        if (fs.existsSync(destCSS)) {
            fs.unlinkSync(destCSS);
        }
        var spawn = child_process.spawn;
        var concatProcess = spawn('node', [path.join(__dirname, '/../index.js'), 
                                              '-f', 
                                              filesCSS,
                                              '-o',
                                              destCSS]);
        concatProcess.stdout.on('end', function() {
            expect(fs.existsSync(destCSS)).to.equal(true);
            done();
        });
    });
});