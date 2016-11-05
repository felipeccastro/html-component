describe('TodoList', () => {

  it('is initialized with summary', () => {
    var todoList = new TodoList()
    todoList.init()
    expect(todoList.query('todo-summary').length == 1)
  })

  it('can add and remove a task', () => {
    var todoList = new TodoList()
    todoList.init()
    todoList.query('.new-todo').value = 'test'
    todoList.addTodo({ preventDefault: function() {}})
    
    var addedTodo = todoList.query('todo-item')
    expect(addedTodo.get('desc') == 'test')

    var todoItem = todoList.query('todo-item[desc="test"]')
    todoItem.query('button.remove').click()
    expect(todoList.query('todo-item[desc=test]') == null)
  })

})