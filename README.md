# HTML Component
Build component-based UIs without frameworks, just vanilla ES6 and Custom Elements.

## What?
You know how in frontend frameworks like React/Angular/Vue you can split your entire UI in small, self-contained components?
It turns out you can get a similar kind of organization without any framework, using native Custom Elements.

## Why?
Splitting a complex page into small, self contained components is really helpful for ease of maintenance. If that's all you're interested, you shouldn't need to pull a framework for that.
Frontend frameworks can be really helpful, but they have their own share of problems: the payload size, lack of control, leaky abstractions, vendor lock-in, steep learning curve, etc.
In the meantime, browsers are implementing Web Components natively and some parts of it, like Custom Elements, have polyfills stable enough that can be used in production today.

## How does it look?
Here's a sample from the canonical `todo-item` component:
[screenshot]
[link to todo-list.js]

## Components
The guidelines for building maintainable components with this approach are more or less similar to what we see in other frameworks:

- keep components small and focused
- single file components: template + behavior + styles together (group by feature, not by technology)
- parent components can communicate with child components, but without accessing their inner DOM
- child components only emit events to notify parents, avoid modifying parents directly
- sibling components don't talk to each other

The easiest way of seeing these principles all in practice is looking the sample Todo App implementation.

## How does it work
HTMLCustomElement is a small base class wrapping the native HTMLElement.
It provides a few helpers to make it easier to adopt this style of development:

- shortcuts for common DOM methods (like `this.on('click', ...)` and `this.publish('some-event')`)
- support for event delegation, so components can be re-rendered without losing their events
- `.get()` and `.set()` based on html attributes (similar to "props" in React)
- changes to props automatically re-render components, greatly reducing the amount of manual DOM manipulation necessary
- html and csjs tagged template helpers for enabling syntax highlighting
- styles get scoped to the custom element, e.g. `h1 { color: red }` becomes `todo-item h1 { color: red }`

## Dependencies
- [document-register-element.js]() (Custom Elements v1 polyfill): not required for Chrome
- [dom4.js]() (DOM4 methods polyfills): optional, but makes it way easier to work with the DOM
- [polyfill.io](): optional, builds custom ES5 polyfills for older browsers.

## Build
If you're developing on Chrome latest, *no build step is necessary*. No file watchers, no just in time compilation, just run ES6 natively.
For production (`npm run build`), this project uses `Babel` to compile ES6 to ES5 and `postcss` to add vendor prefixes to the component styles.

## Editor
Having templates, styles and behaviors in the same js file can be challenging to some editors.
The screenshot above was taken with Atom on the default javascript syntax, which automatically uses the html syntax highlighting for tagged template strings using a tag called `html`.
For css, I'm using the `csjs` syntax highlighting and autocomplete, but not the actual tagged template helper.

## Getting Started
Clone this project and modify it as you wish!

## FAQ

### Oh great, another MVC framework...
This is not a framework, much less MVC. This is more like a boilerplate web project with some very optionated development approaches.

### How is it different from React/Angular/Vue...?
These frameworks all have built their own non-standard model of components, parallel to the native browser functionalities.
They also build on the approach of abstracting the DOM and having a state/model object being the single source of truth, leaving the DOM manipulation entirely to the framework. While there are benefits to this approach, it also comes with a cost.
Using vanilla Custom Elements and ES6 means the DOM is the source of truth, and you'll manipulate it directly, but don't panic! Not only the DOM api is much better to work with these days, but having it split over components that can be easily re-rendered from a template also makes it much simpler to build powerful UIs.

### Why not Polymer?
I like very much of the idea behind Polymer, having a small framework on top of all the 4 Web Components technologies (Templates, HTML Imports, Shadow DOM and Custom Elements) and overall push the adoption of Web Standards. However, the framework is entirely dependent on the stability of the polyfills, and some technologies are harder to polyfill than others (like Shadow DOM, for example). It also doesn't inspire a lot of confidence the fact that until today, not all browsers have agreed to implement all of these technologies. They did agree to implement Custom Elements v1, though, so depending only on that seems like a safe ground to proceed.

### What about performance? Is it webscale(TM)?
You'll have complete control over what happens on the DOM, so how fast it is depends on how well you know vanilla javascript.
The main polyfill, document-register-element, is based on native  MutationObservers (which is pretty fast), so there's no inherent technical reason for this approach to have performance issues.
