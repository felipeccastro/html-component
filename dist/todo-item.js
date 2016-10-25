var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
  'use strict';

  var _templateObject = _taggedTemplateLiteral(['\n    <input type="checkbox" ', '>\n    <input type="text" class="desc" readonly value="', '" />\n    <button class="remove">', '</button>\n  '], ['\n    <input type="checkbox" ', '>\n    <input type="text" class="desc" readonly value="', '" />\n    <button class="remove">', '</button>\n  ']),
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