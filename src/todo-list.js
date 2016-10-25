class TodoList extends HTMLComponent {

  template(props) { return html `
    <form class="actions">
      <input type="checkbox" class="toggle-all" />
      <input type="text" class="new-todo"
        placeholder="What needs to be done?">
    </form>
    <section class="todos">
    ${ this.items.map(todo => html`
      <todo-item done="${todo.done}"
                 desc="${todo.desc}">
      </todo-item>
    `)}
    </section>
    <todo-summary></todo-summary>
  `}

  get active() { return this.queryAll('todo-item:not([done=true])') }
  get completed() { return this.queryAll('todo-item[done=true]') }

  init() {
    this.items = []

    this.render()
    .on('submit', '.actions', e => this.addTodo(e))
    .on('change', '.toggle-all', e => this.toggleAll(e))
    .on('toggled', 'todo-item', e => this.updateSummary())
    .on('remove', 'todo-item', e => e.target.remove())
    .on('clear-completed', 'todo-summary', e => this.clearCompleted())
    .on('change-filter', 'todo-summary', e => this.changeFilter(e))
    .afterEach(e => { this.updateSummary(), this.storeList() })

    var itemsSaved = localStorage.getItem('my-todos')
    if (itemsSaved) {
      this.items = JSON.parse(itemsSaved)
      this.render()
    }

    this.updateSummary()
  }

  addTodo(e) {
    e.preventDefault()
    var newTodo = this.query('.new-todo')
    var newTodoDesc = newTodo.value.trim()
    if (!newTodoDesc) return false

    var item = TodoItem.create({ desc: newTodoDesc })
    this.query('.todos').prepend(item)

    newTodo.value = ''
    newTodo.focus()
  }

  toggleAll(e) {
    this.queryAll('todo-item')
      .forEach(item => item.set({ done: e.target.checked }))
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
    setTimeout(() => {
      var items = this.queryAll('todo-item').map(item => item.props)
      localStorage.setItem('my-todos', JSON.stringify(items))
    }, 10)
  }

}

TodoList.styles = csjs`
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
`

TodoList.register('todo-list')
