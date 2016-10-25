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