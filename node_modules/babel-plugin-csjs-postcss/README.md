# babel-plugin-csjs-postcss

[![build status][build-badge]][build-href]
[![dependencies status][deps-badge]][deps-href]

Babel plugin for running [PostCSS](https://github.com/postcss/postcss) on [CSJS](https://github.com/rtsao/csjs) at build time

### [Autoprefixer](https://github.com/postcss/autoprefixer) example
```sh
npm i babel-plugin-csjs-postcss autoprefixer --save-dev
```

**Before:**
```javascript
csjs`

.foo {
  transform: ${foo};
}

`;
```

**After:**
```javascript
csjs`

.foo {
  -webkit-transform: ${ foo };
          transform: ${ foo };
}

`;
```

**.babelrc**
```
{
  "plugins": [["csjs-postcss", {
    "plugins": ["autoprefixer"]
  }]]
}
```


### Advanced Configuration

**.babelrc**
```
{
  "plugins": [["csjs-postcss", {
    "plugins": [["autoprefixer", {"browsers": ["last 2 versions"]}]]
  }]]
}
```

[build-badge]: https://travis-ci.org/rtsao/babel-plugin-csjs-postcss.svg?branch=master
[build-href]: https://travis-ci.org/rtsao/babel-plugin-csjs-postcss
[deps-badge]: https://david-dm.org/rtsao/babel-plugin-csjs-postcss.svg
[deps-href]: https://david-dm.org/rtsao/babel-plugin-csjs-postcss
