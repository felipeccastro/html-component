## concat-cli

Just a simple wrapper around the [concat](https://www.npmjs.org/package/concat) module, to concatenate files via the command line



## Install

```bash
$ npm install -g concat-cli
```



## Usage

Pass the files to concatenate (-f or --files parameter) to the tool, and optionally and destination file (-o or --output parameter):

```bash
$ concat-cli -f *.js -o bundle.js
```
Concat-cli will create the bundle.js file, if it doesn't exists, and dump the content of all the passed files into that one. If you don't provide an output file, the tool will concatenate everything into a file called 'all', with the correct extension.


## Test

```bash
$ npm test
```