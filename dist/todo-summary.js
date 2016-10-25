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