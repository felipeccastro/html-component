var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
	'use strict';

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
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

		_createClass(HTMLComponent, [{
			key: 'is',
			get: function get() {
				return this.nodeName.toLowerCase();
			}
		}]);

		// Required by the custom elements polyfill
		function HTMLComponent(_) {
			var _this, _ret;

			_classCallCheck(this, HTMLComponent);

			return _ret = ((_ = (_this = _possibleConstructorReturn(this, (HTMLComponent.__proto__ || Object.getPrototypeOf(HTMLComponent)).call(this, _)), _this)).init(), _), _possibleConstructorReturn(_this, _ret);
		}

		_createClass(HTMLComponent, [{
			key: 'init',
			value: function init() {/* override on custom elements */}
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
				this.classList.toggle('hidden', showOrHide);
			}
		}, {
			key: 'render',
			value: function render() {
				// Optionally mark a section to not be replaced on re-renders
				var fixed = this.query('[fixed]');
				// Helper function for innerHTML, required by the custom elements polyfill
				innerHTML(this, this.template(this.props));
				if (fixed) {
					this.query('[fixed]').replaceWith(fixed);
				}
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
			value: function register(tagName) {
				customElements.define(tagName, this);
				// scope the styles and add them to head
				registerStyles(tagName, this.styles);
				// ensure element is accessible on global scope
				window[this.name] = this;
			}
		}]);

		return HTMLComponent;
	}(HTMLElement);

	// Tagged templates for activating syntax highlighting
	// http://www.2ality.com/2015/01/template-strings-html.html
	window.html = function html(literalSections) {
		// Use raw literal sections: we don’t want
		// backslashes (\n etc.) to be interpreted
		var raw = literalSections.raw;

		var result = '';

		for (var _len = arguments.length, substs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			substs[_key - 1] = arguments[_key];
		}

		substs.forEach(function (subst, i) {
			// Retrieve the literal section preceding
			// the current substitution
			var lit = raw[i];

			// In the example, map() returns an array:
			// If substitution is an array (and not a string),
			// we turn it into a string
			if (Array.isArray(subst)) {
				subst = subst.join('');
			}

			// If the substitution is preceded by a dollar sign,
			// we escape special characters in it
			if (lit.endsWith('$')) {
				subst = htmlEscape(subst);
				lit = lit.slice(0, -1);
			}
			result += lit;
			result += subst;
		});
		// Take care of last literal section
		// (Never fails, because an empty template string
		// produces one literal section, an empty string)
		result += raw[raw.length - 1]; // (A)

		return result;
	};

	function htmlEscape(str) {
		if (!str) return '';
		return str.replace(/&/g, '&amp;') // first!
		.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;');
	}

	// Tagged template helper to enable syntax highlighting
	window.csjs = function css(stylesheet) {
		for (var _len2 = arguments.length, expressions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			expressions[_key2 - 1] = arguments[_key2];
		}

		return stylesheet.reduce(function (accumulator, part, i) {
			return accumulator + expressions[i - 1] + part;
		});
	};

	// Scope css and write style tag to head
	function registerStyles(tagName, styles) {
		if (!styles) return;
		var styleTag = document.createElement('style');
		styleTag.innerHTML = scopeCss(styles.trim(), tagName);
		document.head.appendChild(styleTag);
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

	// Helper required by the custom elements polyfill
	// Ensures elements created with a template string are immediately upgraded to custom elements
	/*! (C) Andrea Giammarchi - @WebReflection - Mit Style License */
	// see https://github.com/WebReflection/document-register-element/issues/21#issuecomment-102020311
	window.innerHTML = function (e) {
		var t = "extends",
		    n = e.registerElement,
		    r = e.createElement("div"),
		    i = "document-register-element",
		    s = n.innerHTML,
		    o,
		    u;if (s) return s;try {
			n.call(e, i, { prototype: Object.create(HTMLElement.prototype, { createdCallback: { value: Object } }) }), r.innerHTML = "<" + i + "></" + i + ">";if ("createdCallback" in r.querySelector(i)) return n.innerHTML = function (e, t) {
				return e.innerHTML = t, e;
			};
		} catch (a) {}return u = [], o = function o(t) {
			if ("createdCallback" in t || "attachedCallback" in t || "detachedCallback" in t || "attributeChangedCallback" in t) return;e.createElement.innerHTMLHelper = !0;for (var n = t.parentNode, r = t.getAttribute("is"), i = t.nodeName, s = e.createElement.apply(e, r ? [i, r] : [i]), o = t.attributes, u = 0, a = o.length, f, l; u < a; u++) {
				f = o[u], s.setAttribute(f.name, f.value);
			}s.createdCallback && (s.created = !0, s.createdCallback(), s.created = !1);while (l = t.firstChild) {
				s.appendChild(l);
			}e.createElement.innerHTMLHelper = !1, n && n.replaceChild(s, t);
		}, (e.registerElement = function (i, s) {
			var o = (s[t] ? s[t] + '[is="' + i + '"]' : i).toLowerCase();return u.indexOf(o) < 0 && u.push(o), n.apply(e, arguments);
		}).innerHTML = function (e, t) {
			e.innerHTML = t;for (var n = e.querySelectorAll(u.join(",")), r = n.length; r--; o(n[r])) {}return e;
		};
	}(document);
})();
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
  'use strict';

  var _templateObject = _taggedTemplateLiteral(['\n    <input type="checkbox" ', '>\n    <input type="text" class="desc" readonly value="$', '" />\n    <button class="remove">', '</button>\n  '], ['\n    <input type="checkbox" ', '>\n    <input type="text" class="desc" readonly value="$', '" />\n    <button class="remove">', '</button>\n  ']),
      _templateObject2 = _taggedTemplateLiteral(['\n  :host {\n    display: block;\n    width: 100%;\n    padding: 7px;\n    background: white;\n    border: 1px solid whitesmoke;\n  }\n\n  :host:hover,\n  :host:hover .desc[readonly] {\n    background: whitesmoke;\n  }\n\n  :host[done=true] .desc[readonly] {\n    text-decoration: line-through;\n  }\n\n  :host:hover .remove {\n    display: inline-block;\n  }\n\n  input.desc {\n    width: 85%;\n    font-size: 14px;\n  }\n\n  input.desc[readonly] {\n    border: none;\n  }\n\n  input[type=checkbox] {\n    width: 20px;\n    height: 20px;\n    position: relative;\n    top: 5px;\n  }\n\n  .remove {\n    display: none;\n    background: transparent;\n    font-size: 16px;\n    border: none;\n    padding: 4px;\n    cursor: pointer;\n    float: right;\n    color: ', ';\n  }\n\n  .remove:hover {\n    color: ', ';\n  }\n'], ['\n  :host {\n    display: block;\n    width: 100%;\n    padding: 7px;\n    background: white;\n    border: 1px solid whitesmoke;\n  }\n\n  :host:hover,\n  :host:hover .desc[readonly] {\n    background: whitesmoke;\n  }\n\n  :host[done=true] .desc[readonly] {\n    text-decoration: line-through;\n  }\n\n  :host:hover .remove {\n    display: inline-block;\n  }\n\n  input.desc {\n    width: 85%;\n    font-size: 14px;\n  }\n\n  input.desc[readonly] {\n    border: none;\n  }\n\n  input[type=checkbox] {\n    width: 20px;\n    height: 20px;\n    position: relative;\n    top: 5px;\n  }\n\n  .remove {\n    display: none;\n    background: transparent;\n    font-size: 16px;\n    border: none;\n    padding: 4px;\n    cursor: pointer;\n    float: right;\n    color: ', ';\n  }\n\n  .remove:hover {\n    color: ', ';\n  }\n']);

  function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

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

  var TodoItem = function (_HTMLComponent) {
    _inherits(TodoItem, _HTMLComponent);

    function TodoItem() {
      _classCallCheck(this, TodoItem);

      return _possibleConstructorReturn(this, (TodoItem.__proto__ || Object.getPrototypeOf(TodoItem)).apply(this, arguments));
    }

    _createClass(TodoItem, [{
      key: 'template',
      value: function template(todo) {
        return html(_templateObject, todo.done ? 'checked' : '', todo.desc, icons.remove);
      }
    }, {
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

  TodoItem.styles = csjs(_templateObject2, theme.red, theme.darkRed);

  TodoItem.register('todo-item');
})();
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
  'use strict';

  var _templateObject = _taggedTemplateLiteral(['\n    <form class="actions">\n      <input type="checkbox" class="toggle-all" />\n      <input type="text" class="new-todo"\n        placeholder="What needs to be done?">\n    </form>\n    <section class="todos">\n    ', '\n    </section>\n    <todo-summary></todo-summary>\n  '], ['\n    <form class="actions">\n      <input type="checkbox" class="toggle-all" />\n      <input type="text" class="new-todo"\n        placeholder="What needs to be done?">\n    </form>\n    <section class="todos">\n    ', '\n    </section>\n    <todo-summary></todo-summary>\n  ']),
      _templateObject2 = _taggedTemplateLiteral(['\n      <todo-item done="', '"\n                 desc="', '">\n      </todo-item>\n    '], ['\n      <todo-item done="', '"\n                 desc="', '">\n      </todo-item>\n    ']),
      _templateObject3 = _taggedTemplateLiteral(['\n  .actions {\n    display: block;\n    width: 100%;\n    margin: 0;\n    padding: 7px;\n  }\n  .new-todo {\n    font-size: 16px;\n    line-height: 28px;\n    border: none;\n    width: 85%;\n    padding-left: 5px;\n  }\n  .toggle-all {\n    width: 20px;\n    height: 20px;\n    position: relative;\n    top: 5px;\n  }\n'], ['\n  .actions {\n    display: block;\n    width: 100%;\n    margin: 0;\n    padding: 7px;\n  }\n  .new-todo {\n    font-size: 16px;\n    line-height: 28px;\n    border: none;\n    width: 85%;\n    padding-left: 5px;\n  }\n  .toggle-all {\n    width: 20px;\n    height: 20px;\n    position: relative;\n    top: 5px;\n  }\n']);

  function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

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

  var TodoList = function (_HTMLComponent) {
    _inherits(TodoList, _HTMLComponent);

    function TodoList() {
      _classCallCheck(this, TodoList);

      return _possibleConstructorReturn(this, (TodoList.__proto__ || Object.getPrototypeOf(TodoList)).apply(this, arguments));
    }

    _createClass(TodoList, [{
      key: 'template',
      value: function template(props) {
        return html(_templateObject, this.items.map(function (todo) {
          return html(_templateObject2, todo.done, todo.desc);
        }));
      }
    }, {
      key: 'init',
      value: function init() {
        var _this2 = this;

        this.items = [];

        this.render().on('submit', '.actions', function (e) {
          return _this2.addTodo(e);
        }).on('change', '.toggle-all', function (e) {
          return _this2.toggleAll(e);
        }).on('toggled', 'todo-item', function (e) {
          return _this2.updateSummary();
        }).on('remove', 'todo-item', function (e) {
          return e.target.remove();
        }).on('clear-completed', 'todo-summary', function (e) {
          return _this2.clearCompleted();
        }).on('change-filter', 'todo-summary', function (e) {
          return _this2.changeFilter(e);
        }).afterEach(function (e) {
          _this2.updateSummary(), _this2.storeList();
        });

        var itemsSaved = localStorage.getItem('my-todos');
        if (itemsSaved) {
          this.items = JSON.parse(itemsSaved);
          this.render();
        }

        this.updateSummary();
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
        this.queryAll('todo-item').forEach(function (item) {
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
        var _this3 = this;

        setTimeout(function () {
          var items = _this3.queryAll('todo-item').map(function (item) {
            return item.props;
          });
          localStorage.setItem('my-todos', JSON.stringify(items));
        }, 10);
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

  TodoList.styles = csjs(_templateObject3);

  TodoList.register('todo-list');
})();
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
  'use strict';

  var _templateObject = _taggedTemplateLiteral(['\n    <label class="items-left">\n      ', ' ', ' left\n    </label>\n    <section class="filters">\n    ', '\n    </section>\n    <button class="clear-completed ', '">\n      Clear completed\n    </button>\n  '], ['\n    <label class="items-left">\n      ', ' ', ' left\n    </label>\n    <section class="filters">\n    ', '\n    </section>\n    <button class="clear-completed ', '">\n      Clear completed\n    </button>\n  ']),
      _templateObject2 = _taggedTemplateLiteral(['\n      <button data-filter="', '" class="filter\n        ', '">\n        ', '\n      </button>\n    '], ['\n      <button data-filter="', '" class="filter\n        ', '">\n        ', '\n      </button>\n    ']),
      _templateObject3 = _taggedTemplateLiteral(['\n  :host {\n    display: block;\n    padding: 7px;\n  }\n\n  :host[active="0"][completed="0"] {\n    display: none;\n  }\n\n  .items-left {\n    display: inline-block;\n    font-size: 15px;\n    color: ', ';\n  }\n\n  .filters {\n    margin-left: auto;\n    margin-right: auto;\n    width: 185px;\n    margin-top: -19px;\n  }\n\n  .filter:first-letter {\n    text-transform:capitalize;\n  }\n\n  .filter:focus {\n    outline: none;\n  }\n\n  .filter.selected {\n    border: 1px solid ', ';\n  }\n\n  button {\n    cursor: pointer;\n    border: none;\n    background: white;\n    font-size: 13px;\n    color: ', ';\n    border: 1px solid transparent;\n  }\n\n  button:hover {\n    text-decoration: underline;\n  }\n\n  .clear-completed {\n    float: right;\n    margin-top: -23px;\n  }\n'], ['\n  :host {\n    display: block;\n    padding: 7px;\n  }\n\n  :host[active="0"][completed="0"] {\n    display: none;\n  }\n\n  .items-left {\n    display: inline-block;\n    font-size: 15px;\n    color: ', ';\n  }\n\n  .filters {\n    margin-left: auto;\n    margin-right: auto;\n    width: 185px;\n    margin-top: -19px;\n  }\n\n  .filter:first-letter {\n    text-transform:capitalize;\n  }\n\n  .filter:focus {\n    outline: none;\n  }\n\n  .filter.selected {\n    border: 1px solid ', ';\n  }\n\n  button {\n    cursor: pointer;\n    border: none;\n    background: white;\n    font-size: 13px;\n    color: ', ';\n    border: 1px solid transparent;\n  }\n\n  button:hover {\n    text-decoration: underline;\n  }\n\n  .clear-completed {\n    float: right;\n    margin-top: -23px;\n  }\n']);

  function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

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

  var TodoSummary = function (_HTMLComponent) {
    _inherits(TodoSummary, _HTMLComponent);

    function TodoSummary() {
      _classCallCheck(this, TodoSummary);

      return _possibleConstructorReturn(this, (TodoSummary.__proto__ || Object.getPrototypeOf(TodoSummary)).apply(this, arguments));
    }

    _createClass(TodoSummary, [{
      key: 'template',
      value: function template(props) {
        return html(_templateObject, props.active, props.active == 1 ? 'item' : 'items', this.filters.map(function (filter) {
          return html(_templateObject2, filter, filter == props.filter ? 'selected' : '', filter);
        }), props.completed == 0 ? 'hidden' : '');
      }
    }, {
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
        var filter = e.target.dataset.filter;
        this.set({ filter: filter });
        this.publish('change-filter', filter);
      }
    }, {
      key: 'total',
      get: function get() {
        return this.get('active') + this.get('completed');
      }
    }, {
      key: 'filters',
      get: function get() {
        return ['all', 'active', 'completed'];
      }
    }]);

    return TodoSummary;
  }(HTMLComponent);

  TodoSummary.styles = csjs(_templateObject3, theme.gray, theme.lightRed, theme.gray);

  TodoSummary.register('todo-summary');
})();
