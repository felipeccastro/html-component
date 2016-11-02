
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
	'use strict';

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	// Base class for creating Web Components
	window.HTMLComponent = function (_HTMLElement) {
		_inherits(HTMLComponent, _HTMLElement);

		function HTMLComponent() {
			_classCallCheck(this, HTMLComponent);

			return _possibleConstructorReturn(this, (HTMLComponent.__proto__ || Object.getPrototypeOf(HTMLComponent)).apply(this, arguments));
		}

		_createClass(HTMLComponent, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				this.init();
				this.publish('ready');
			}
		}, {
			key: 'init',
			value: function init() {
				this.render();
			}
		}, {
			key: 'on',
			value: function on(eventName, selector, callback) {
				var _arguments = arguments,
				    _this2 = this;

				this.addEventListener(eventName, function (e) {
					if (_arguments.length == 2) {
						callback = selector;
						handleEvent(e, _this2);
					} else if (e.target.matches(selector)) {
						handleEvent(e, _this2);
					}
				});

				function handleEvent(e, self) {
					if (self._before) self._before(e);
					callback(e);
					if (self._after) self._after(e);
				}

				return this;
			}
		}, {
			key: 'off',
			value: function off(e) {
				this.removeEventListener(e);
			}
		}, {
			key: 'beforeEach',
			value: function beforeEach(handler) {
				this._before = handler;
				return this;
			}
		}, {
			key: 'afterEach',
			value: function afterEach(handler) {
				this._after = handler;
				return this;
			}
		}, {
			key: 'publish',
			value: function publish(eventName, data) {
				this.dispatchEvent(new CustomEvent(eventName, {
					bubbles: true,
					detail: data
				}));
			}
		}, {
			key: 'get',
			value: function get(name) {
				var value = this.getAttribute(name);
				if (value.match(/^(true|false|undefined)$/)) value = value == 'true';else if (!isNaN(value)) value = Number(value);
				return value;
			}
		}, {
			key: 'set',
			value: function set(data) {
				for (var name in data) {
					var value = data[name];
					this.setAttribute(name, value);
				}
				return this.render();
			}
		}, {
			key: 'show',
			value: function show() {
				this.classList.remove('hidden');
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.classList.add('hidden');
			}
		}, {
			key: 'toggle',
			value: function toggle(showOrHide) {
				showOrHide ? this.setAttribute('hidden', 'hidden') : this.removeAttribute('hidden');
			}
		}, {
			key: 'template',
			value: function template(data) {
				var tagName = this.constructor.is;
				var tmpl = HTMLComponentTemplates[tagName];
				return tmpl.render(data);
			}
		}, {
			key: 'render',
			value: function render() {
				// Helper function for innerHTML, required by the custom elements polyfill
				innerHTML(this, this.template(this));
				fixBooleanAttributes(this);
				return this;
			}
		}, {
			key: 'props',
			get: function get() {
				var s = {};
				var props = this.attributes;
				for (var i = props.length - 1; i >= 0; i--) {
					var prop = props[i].name;
					s[prop] = this.get(prop);
				}
				return s;
			}
		}], [{
			key: 'create',
			value: function create(props) {
				return new this().set(props);
			}
		}, {
			key: 'register',
			value: function register() {
				var tagName = this.is;

				if (HTMLComponentTemplates.shouldCompile) {
					// get html import's document for finding the template tag
					// optionally the template might be inlined in the main document
					var templateDoc = document.currentScript && document.currentScript.ownerDocument ? document.currentScript.ownerDocument : document;

					var templateTag = templateDoc.getElementById(tagName);
					if (templateTag) {
						// need to clone template before we can use it
						templateTag = templateTag.cloneNode(true);

						// try to find a style tag in the template
						var compStyle = templateTag.content.querySelector('style');
						if (compStyle) {

							// scope component's style and append it to document.head
							var stylesTag = document.getElementById('html-components-styles');
							if (!stylesTag) {
								stylesTag = document.createElement('style');
								stylesTag.id = 'html-components-styles';
								document.head.appendChild(stylesTag);
							}

							stylesTag.append(scopeCss(compStyle.innerHTML, tagName));
							// remove style tag so the mustache template is just what's left
							templateTag.content.removeChild(compStyle);
						}

						// store compiled mustache template
						var template = templateTag.innerHTML.trim();
						if (template) {
							HTMLComponentTemplates[tagName] = Hogan.compile(template);
						}
					}
				}

				customElements.define(this.is, this);
			}
		}, {
			key: 'is',
			get: function get() {
				return this.name.replace(/([a-z][A-Z])/g, function (g) {
					return g[0] + '-' + g[1];
				}).toLowerCase();
			}
		}]);

		return HTMLComponent;
	}(HTMLElement);

	if (!window.HTMLComponentTemplates) window.HTMLComponentTemplates = {};

	// for dev only, use precompiled assets for production instead
	if (typeof HTMLComponentTemplates.shouldCompile == 'undefined') HTMLComponentTemplates.shouldCompile = true;

	HTMLComponent.booleanAttributes = 'checked disabled hidden selected autocomplete autofocus'.split(' ');

	// Add or remove boolean attributes depending on their value
	// this is needed to make mustache templates compatible with template tags
	function fixBooleanAttributes(component) {
		HTMLComponent.booleanAttributes.forEach(function (attr) {
			component.queryAll('[' + attr + ']').forEach(function (elm) {
				if (elm.getAttribute(attr).match(new RegExp('true|1|' + attr))) {
					elm.setAttribute(attr, attr);
				} else {
					elm.removeAttribute(attr);
				}
			});
		});
	}

	// If using native custom elements, the innerHTML helper won't exist
	if (!window.innerHTML) {
		window.innerHTML = function (elm, html) {
			elm.innerHTML = html;
		};
	}

	/*
 	Scope a css block to a parent selector
  	e.g.
 		 :host { display: block }
 	   .foo { color: blue }
 	becomes
 	  my-component { display: block }
 		my-component .foo { color: blue }
   https://github.com/dfcreative/scope-css
 */
	function scopeCss(css, parent) {
		if (!css) return css;
		if (!parent) return css;

		function replace(css, replacer) {
			//strip block comments
			css = css.replace(/\/\*([\s\S]*?)\*\//g, '');
			return css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, replacer);
		}

		css = replace(css, parent + ' $1$2');

		//regexp.escape
		var parentRe = parent.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		//replace self-selectors
		css = css.replace(new RegExp('(' + parentRe + ')\\s*\\1(?=[\\s\\r\\n,{])', 'g'), '$1');
		//replace `:host` with parent
		css = css.replace(new RegExp('(' + parentRe + ')\\s*:host', 'g'), '$1');
		//revoke wrongly replaced @ statements, like @supports, @import, @media etc.
		css = css.replace(new RegExp('(' + parentRe + ')\\s*@', 'g'), '@');

		return css;
	}
})();
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  window.TodoItem = function (_HTMLComponent) {
    _inherits(TodoItem, _HTMLComponent);

    function TodoItem() {
      _classCallCheck(this, TodoItem);

      return _possibleConstructorReturn(this, (TodoItem.__proto__ || Object.getPrototypeOf(TodoItem)).apply(this, arguments));
    }

    _createClass(TodoItem, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        this.render().on('change', '[type=checkbox]', function (e) {
          return _this2.toggleDone(e);
        }).on('click', '.remove', function (e) {
          return _this2.publish('remove');
        }).on('dblclick', '.desc', function (e) {
          return _this2.edit(e);
        }).on('keyup', '.desc', function (e) {
          return _this2.save(e);
        }).on('focusout', '.desc', function (e) {
          return _this2.render();
        });
      }
    }, {
      key: 'edit',
      value: function edit(e) {
        e.target.removeAttribute('readonly');
        e.target.focus();
      }
    }, {
      key: 'save',
      value: function save(e) {
        if (e.keyCode == 13) this.set({ desc: e.target.value });
      }
    }, {
      key: 'toggleDone',
      value: function toggleDone(e) {
        this.set({ done: e.target.checked });
        this.publish('toggled');
      }
    }]);

    return TodoItem;
  }(HTMLComponent);

  TodoItem.register();
})();
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  window.TodoList = function (_HTMLComponent) {
    _inherits(TodoList, _HTMLComponent);

    function TodoList() {
      _classCallCheck(this, TodoList);

      return _possibleConstructorReturn(this, (TodoList.__proto__ || Object.getPrototypeOf(TodoList)).apply(this, arguments));
    }

    _createClass(TodoList, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        this.render().on('submit', '.actions', function (e) {
          return _this2.addTodo(e);
        }).on('change', '.toggle-all', function (e) {
          return _this2.toggleAll(e);
        }).on('toggled', 'todo-item', function (e) {
          return _this2.updateSummary();
        }).on('remove', 'todo-item', function (e) {
          return e.target.remove();
        }).on('ready', 'todo-summary', function (e) {
          return _this2.updateSummary();
        }).on('clear-completed', 'todo-summary', function (e) {
          return _this2.clearCompleted();
        }).on('change-filter', 'todo-summary', function (e) {
          return _this2.changeFilter(e);
        }).afterEach(function (e) {
          _this2.updateSummary(), _this2.storeList();
        });

        var savedItems = localStorage.getItem('my-todos');
        if (savedItems) {
          this.items = JSON.parse(savedItems);
          this.render();
        }
      }
    }, {
      key: 'addTodo',
      value: function addTodo(e) {
        e.preventDefault();
        var newTodo = this.query('.new-todo');
        var newTodoDesc = newTodo.value.trim();
        if (!newTodoDesc) return false;

        var item = TodoItem.create({ desc: newTodoDesc });
        this.query('.todos').prepend(item);

        newTodo.value = '';
        newTodo.focus();
      }
    }, {
      key: 'toggleAll',
      value: function toggleAll(e) {
        this.todos.forEach(function (item) {
          return item.set({ done: e.target.checked });
        });
      }
    }, {
      key: 'clearCompleted',
      value: function clearCompleted() {
        this.completed.forEach(function (item) {
          return item.remove();
        });
        this.query('.toggle-all').checked = false;
      }
    }, {
      key: 'changeFilter',
      value: function changeFilter(e) {
        this.active.forEach(function (item) {
          return item.toggle(e.detail == 'completed');
        });
        this.completed.forEach(function (item) {
          return item.toggle(e.detail == 'active');
        });
      }
    }, {
      key: 'updateSummary',
      value: function updateSummary() {
        this.query('todo-summary').set({
          active: this.active.length,
          completed: this.completed.length
        });
      }
    }, {
      key: 'storeList',
      value: function storeList(e) {
        var items = this.todos.map(function (item) {
          return item.props;
        });
        localStorage.setItem('my-todos', JSON.stringify(items));
      }
    }, {
      key: 'todos',
      get: function get() {
        return this.queryAll('todo-item');
      }
    }, {
      key: 'active',
      get: function get() {
        return this.queryAll('todo-item:not([done=true])');
      }
    }, {
      key: 'completed',
      get: function get() {
        return this.queryAll('todo-item[done=true]');
      }
    }]);

    return TodoList;
  }(HTMLComponent);

  TodoList.register();
})();
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  window.TodoSummary = function (_HTMLComponent) {
    _inherits(TodoSummary, _HTMLComponent);

    function TodoSummary() {
      _classCallCheck(this, TodoSummary);

      return _possibleConstructorReturn(this, (TodoSummary.__proto__ || Object.getPrototypeOf(TodoSummary)).apply(this, arguments));
    }

    _createClass(TodoSummary, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        this.render().on('click', '.filter', function (e) {
          return _this2.changeFilter(e);
        }).on('click', '.clear-completed', function (e) {
          return _this2.publish('clear-completed');
        });
      }
    }, {
      key: 'changeFilter',
      value: function changeFilter(e) {
        var filter = e.target.textContent.trim();
        this.set({ filter: filter });
        this.publish('change-filter', filter);
      }
    }, {
      key: 'total',
      get: function get() {
        return this.props.active + this.props.completed;
      }
    }, {
      key: 'noItems',
      get: function get() {
        return this.total == 0;
      }
    }, {
      key: 'itemsLeft',
      get: function get() {
        return (this.props.active == 1 ? 'item' : 'items') + ' left';
      }
    }, {
      key: 'filters',
      get: function get() {
        var _this3 = this;

        return ['all', 'active', 'completed'].map(function (filter) {
          var selected = filter == _this3.props.filter ? 'selected' : '';
          return { desc: filter, selected: selected };
        });
      }
    }]);

    return TodoSummary;
  }(HTMLComponent);

  TodoSummary.register();
})();