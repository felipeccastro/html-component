# HTMLComponent
Build component-based UIs without frameworks, just vanilla ES6 and Custom Elements.

## What?
You know how in frontend frameworks like React/Angular/Vue you can split your entire UI in small, self-contained components?
It turns out you can get a similar kind of organization without any framework.

## Why?
Splitting a complex page into small, self contained components is really helpful for ease of maintenance. If that's all you're interested, and are ok with manipulating the DOM yourself, you shouldn't need to pull a framework for that.
Frontend frameworks can be really helpful, but they have their own share of problems: the payload size, lack of control, leaky abstractions, vendor lock-in, steep learning curve, integration with browser dev tools, etc.
In the meantime, browsers are implementing Web Components natively and some parts of it, like Custom Elements, have polyfills stable enough that can be used in production today.

## Web components technologies
"Web components" is an umbrella term for 4 different technologies:
- Custom Elements: allow creation of new element tags, with custom behavior
- Template tags: standard approach for holding DOM based templates
- HTML Imports: allow importing an .html file like we can already do with .css and .js files
- Shadow DOM: allow creating an internal DOM for each element, out of the document's main scope.
While all these technologies are great, it's not very easy to use them on all browsers today.
Shadow DOM is very hard to polyfill, and attempts to do it are either slow and/or very complex.
HTML Imports (polyfilled) can have performance issues when there are too many dependencies (each dependency being a new call to the server), and is still subject to spec changes.

The goal of this project is to enable the usage of web components today, by replacing these tricky technologies with safer alternatives, while keeping a simple and modern workflow for development.

## Single file components
One of the best patterns for organizing self-contained components is to have each one in a single file, complete with template, style and script.
Using native html imports + html-component, you can describe a component like this:

```html
<!-- hello-world.html -->
<template id="hello-world">
  <!-- Mustache template -->
  <p>Hello {{props.to}}!</p>


  <style> /* scoped to component */
    p { font-weight: bold }
  </style>
</template>

<script>
  class HelloWorld extends HTMLComponent {
    init() { this.render() }
  }

  HelloWorld.register()
</script>
```

And then, import and use it like this:

```html
<!-- index.html (Development) -->
<link href="src/html-component.html" rel="import" />
<link href="src/hello-world.html" rel="import" />
<div id="container">
  <!-- attributes becomes 'props' on the component -->
  <hello-world to="world"></hello-world>
</div>
```

The component will automatically register itself on the page it was attached to.
Usually, this would mean simply calling `customElements.define('hello-world', HelloWorld)`.
Besides that, the `HelloWorld.register()` method called above does a few things more:
- compile the template as a mustache template (used by the `this.render()` method)
- scope the style to the component (the example above will render as `hello-world p { font-weight: bold }`), as a super simple alternative to Shadow DOM

This provides a nice workflow, since **no build step is necessary in development**
for browsers supporting native html imports (currently, only Google Chrome).
No file watchers, no just in time compilation, just run the app natively.

## Build process
For other browsers, use the [build-html-component](https://github.com/felipeccastro/html-component/blob/master/bin/build-html-component)
custom script for converting all these HTML imports into old-school combined js and css assets:

```html
<!-- index.html (Production) -->
<link href="dist/components.css" rel="stylesheet" />
<script src="dist/templates.js"></script>
<script src="dist/components.js"></script>
<div id="container">
  <hello-world to="world"></hello-world>
</div>
```

Steps performed in the build script:
- precompiles mustache templates with hogan.js,
- transpiles ES6 scripts to ES5 with babel,
- scopes styles to the component (as described above),
- process the css with postcss-cssnext (enable modern CSS features).

To run the build, first `npm install` all dependencies, then `npm run build`.

## HTMLComponent class
HTMLComponent is a small base class wrapping the native HTMLElement.
It provides a few helpers to make it easier to adopt this style of development:

- `this.render()`: invokes the component's template and replace the component's content as the result. It uses the component's mustache template by default. Also fixes boolean attributes in mustache (see Caveats below).
- `this.props`: gets all attributes of the element as a hash, with some basic "guess" type conversion for numbers and booleans.
- `this.set({props})`: updates all attributes of the hash and automatically triggers a re-render. Being able to re-render components means there's a lot less need of manual DOM manipulation.
- `this.on(event, selector, handler)`: attaches events using event delegation, so you can re-render the content of the component without losing the events.
- `this.emit(event, data)`: notify a parent component with a native Custom Event, optionally passing custom data. The parents can listen to this event with the same `this.on()` method.
- `this.beforeEach(event, handler)` and `this.afterEach(event, handler)`: a handler to run before / after all events attached with `this.on()`.
- `this.show()`, `this.hide()` and `this.toggle(showOrHide)`: shortcuts for adding/removing the `hidden` attribute

- `Component.create(props)` (static): shortcut for instantiating a component  with its props.
- `Component.register()` (static): defines custom element and optionally register template/style (see build example above)

For more details, please check the source [HTMLComponent](https://github.com/felipeccastro/html-component/blob/master/src/html-component.html).

## Advanced example
From the canonical Todo application:

```html

<template id="todo-list">

  <form class="actions">
    <input type="checkbox" class="toggle-all" />
    <input type="text" class="new-todo"
      placeholder="What needs to be done?">
  </form>

  <section class="todos">
    {{#items}}
      <todo-item done="{{done}}" desc="{{desc}}"></todo-item>
    {{/items}}
  </section>

  <todo-summary></todo-summary>

  <style>
    .actions {
      display: block;
      width: 100%;
      margin: 0;
      padding: 7px;
    }

    .new-todo {
      font-size: 16px;
      line-height: 28px;
      border: none;
      width: 85%;
      padding-left: 5px;
    }

    .toggle-all {
      width: 20px;
      height: 20px;
      position: relative;
      top: 5px;
    }
  </style>
</template>

<script>
  class TodoList extends HTMLComponent {

    init() {
      this.render()
      .on('submit', '.actions', e => this.addTodo(e))
      .on('change', '.toggle-all', e => this.toggleAll(e))
      .on('toggled', 'todo-item', e => this.updateSummary())
      .on('remove', 'todo-item', e => e.target.remove())
      .on('ready', 'todo-summary', e => this.updateSummary())
      .on('clear-completed', 'todo-summary', e => this.clearCompleted())
      .on('change-filter', 'todo-summary', e => this.changeFilter(e))
      .afterEach(e => { this.updateSummary(), this.storeList() })

      var savedItems = localStorage.getItem('my-todos')
      if (savedItems) {
        this.items = JSON.parse(savedItems)
        this.render()
      }
    }

    get todos() { return this.queryAll('todo-item') }
    get active() { return this.queryAll('todo-item:not([done=true])') }
    get completed() { return this.queryAll('todo-item[done=true]') }

    addTodo(e) {
      e.preventDefault()
      var newTodo = this.query('.new-todo')
      if (!newTodo.value) return false

      var item = TodoItem.create({ desc: newTodo.value.trim() })
      this.query('.todos').prepend(item)

      newTodo.value = ''
      newTodo.focus()
    }

    toggleAll(e) {
      this.todos.forEach(item => item.set({ done: e.target.checked }))
    }

    clearCompleted() {
      this.completed.forEach(item => item.remove())
      this.query('.toggle-all').checked = false
    }

    changeFilter(e) {
      this.active.forEach(item => item.toggle(e.detail == 'completed'))
      this.completed.forEach(item => item.toggle(e.detail == 'active'))
    }

    updateSummary() {
      this.query('todo-summary').set({
        active: this.active.length,
        completed: this.completed.length
      })
    }

    storeList(e) {
      var items = this.todos.map(item => item.props)
      localStorage.setItem('my-todos', JSON.stringify(items))
    }

  }

  TodoList.register()
</script>

```

## Best practices
The guidelines for building maintainable components with this approach are more or less similar to what we see in other frameworks:

- keep components small and focused
- single file components: template + behavior + styles together (group by feature, not by technology)
- parent components can communicate with child components, but without accessing their inner DOM
- child components only emit events to notify parents, don't modify parents  directly
- sibling components don't talk to each other, notify parents instead

An example of these principles all in practice is the sample Todo App implementation:
[todo-list](https://github.com/felipeccastro/html-component/blob/master/src/todo-list.html), [todo-item](https://github.com/felipeccastro/html-component/blob/master/src/todo-item.html) and [todo-summary](https://github.com/felipeccastro/html-component/blob/master/src/todo-summary.html).


## Dependencies
- [document-register-element.js](https://github.com/WebReflection/document-register-element): standalone polyfill for Custom Elements v1, in about 10kb min, supporting most browsers and IE9+.
- [dom4.js](https://github.com/WebReflection/dom4) (DOM4 methods polyfills): optional, makes it easier to work with the DOM so you'll never miss jquery again.


## Getting Started
- Clone this project
- Create your own .html components in /src
- Reference them in index.html


## Caveats
- Mustache templates require a small change in their syntax when handling boolean attributes: `<div {{#completed}} hidden {{/completed}}></div>` won't work, so use `<div hidden="{{completed}}"></div>` instead. The reason is, the first example isn't valid html, and whatever the content of the template tag is, it must be html. In the `render` method, there's a fix for adding/removing these boolean attributes according to their value.

- "scoped" styles don't actually scope, they just add the component's name as a namespace to your selectors. So, in the `<hello-world>` component, `p { font-weight: bold }` becomes `hello-world p { font-weight: bold }`. This has the benefit of simplicity (in comparison with a Shadow DOM polyfill), but keep in mind styles can leak to children of your components.

- don't import other documents in html imports: for production, we simply extract templates, styles and scripts, and ignore any other elements on the html file. This is by design, so we don't need to polyfill HTML Imports on production.

- no ES6 modules support (yet): one of the goals of this project is to run only on technologies that are already implemented in at least one browser, so the development can happen without a build step. In the near future, when browsers add this feature natively, this can be changed.


## FAQ

### Oh great, another MVC framework...
This is not a framework, much less MVC. This is more like a boilerplate web project with a very opinionated build process.

### How is it different from React/Angular/Vue...?
These frameworks all have built their own non-standard model of components, parallel to the native browser functionalities.
They also build on the approach of abstracting the DOM and having a state/model object being the single source of truth, leaving the DOM manipulation entirely to the framework. While there are benefits to this approach, it also comes with a cost.
Using vanilla Custom Elements and ES6 means the DOM is the source of truth, and you'll manipulate it directly, but don't panic! Not only the DOM api is much better to work with these days, but having it split over components that can be easily re-rendered from a template also makes it much simpler to build powerful UIs.

### Why not Polymer?
I like very much of the idea behind Polymer, having a small framework on top of all the 4 Web Components technologies (Templates, HTML Imports, Shadow DOM and Custom Elements) and overall push the adoption of Web Standards. However, the framework is entirely dependent on the stability of the polyfills, and some technologies are harder to polyfill than others (like Shadow DOM, for example). It also doesn't inspire a lot of confidence the fact that until today, not all browsers have agreed to implement all of these technologies. They did agree to implement Custom Elements v1, though, so depending only on that seems like a safe ground to proceed.

### What about performance?
You'll have complete control over what happens on the DOM, so how fast it is depends on how well you know vanilla javascript.
The main polyfill, document-register-element, is based on native  MutationObservers (which is pretty fast), so there's no inherent technical reason for this approach to have performance issues.
