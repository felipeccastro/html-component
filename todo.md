# TODO

x fix build to work with styles inside templates (use jsdom)
x put templates in the same scripts.js file, before the component classes
x rename to components.js and .css
x review dir structure (move todo to samples, src for htmlcomponent, remove old code)
x add cssnext and use variables (or mustache)
- test on ie and firefox
- add some unit testing (like index-dev but index-test)
- update readme (write about group by functionality not by feature, and how dom is the model)

maybe later
- move icons to css/svg
- try to split app.css + icons, themes into a different css file
- try to separate html-component in its own js file

techs
- html: mustache
- css: postcss
- js: es6 and dom4

suffering from javascript fatigue? try native instead

links:
https://developers.google.com/web/fundamentals/getting-started/primers/customelements
https://www.html5rocks.com/en/tutorials/webcomponents/imports/

goals
- simple (less abstractions, more control)
- make dev simpler without build step (simpler workflow, leverage native, native es6 debugging, inspect elements etc)
- depends on reliable tech for prod (only simple/small polyfills, use native when possible)
- future proof (neither tech nor knowledge will be outdated because it's standard)

x port todo components to html
x remove polyfill from index-dev
x fix clear completed

to make html imports work
x use template with mustache and boolean attrs
x put style inside template so it doesn't get render before we scope it
x append style to one style tag in head instead of creating multiples (dev)
x make build automatically add window.className = class className

future: use index-dev for production without a build! \o/

recommended to use chrome, optionally use a watcher to build on file change to dev on other browsers

the dom is the state
render(data) means data + props
props is just a shortcut for external attributes
we can add getters and setters for internal elements too
but explicit (normal getters) so we know when it's one or several elements
or instead of getters just a html attribute like qa or $ and $$

readme: explain two uses
basic: just inherit htmlcomponent and use es6 template strings (move innerhtml helper out of htmlcomponent), and your own build
advanced: single page components, use custom build and dev runtime

how is it different from polymer?
- use html imports only for dev, build .js and .css for prod
- in production, polyfill only custom elements
- uses a different/smaller standalone polyfill for custom elements
- no shadow dom at all - just scoped css
- no complex databinding - just mustache templates

caveats
- scope css don't fully scope (it can leak to children)
- different syntax for mustache boolean attributes
