
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
				var template = window.templates[this.is];
				// Helper function for innerHTML, required by the custom elements polyfill
				innerHTML(this, template.render(this.props));
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
		}]);

		return HTMLComponent;
	}(HTMLElement);

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

  var MyTest = function (_HTMLComponent) {
    _inherits(MyTest, _HTMLComponent);

    function MyTest() {
      _classCallCheck(this, MyTest);

      return _possibleConstructorReturn(this, (MyTest.__proto__ || Object.getPrototypeOf(MyTest)).apply(this, arguments));
    }

    _createClass(MyTest, [{
      key: 'init',
      value: function init() {
        this.render();
      }
    }]);

    return MyTest;
  }(HTMLComponent);

  customElements.define('my-test', MyTest);
})();