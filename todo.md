# TODO

techs
- html: mustache
- css: postcss
- js: es6 and dom4

goals
- simple (less abstractions, more control)
- make dev simpler without build step (simpler workflow, leverage native)
- depends on reliable tech for prod (only simple/small polyfills, use native when possible)
- future proof (neither tech nor knowledge will be outdated because it's standard)

x port todo components to html
x remove polyfill from index-dev
- put templates in the same scripts.js file, in the correct order
- build components.js and .css
- try to separate html components in its own js file
- make build automatically add window.className = class className
- fix clear completed
- review dir structure (move todo to samples, src for htmlcomponent)
- add cssnext and use variables (or mustache)
- move icons to css/svg
- update readme (write about group by functionality not by feature, and how dom is the model)
- dev runtime, add script/style just once
- test on ie and firefox
- fingerprint prod assets

it's possible to keep using mustache but using
checked="{{var}}" instead of {{#var}} checked {{/var}}
so the html is valid
(checked disabled hidden selected autocomplete autofocus )

to make html imports work
- use template with mustache and boolean attrs
- put style inside template so it doesn't get render before we scope it
- append style to one style tag in head instead of creating multiples (dev)

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

dom templating experiments:
http://jsbin.com/dequfupumu/2/edit?html,js,output
http://jsbin.com/dequfupumu/4/edit?html,js,output !
