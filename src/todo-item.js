class TodoItem extends HTMLComponent {

  template(todo) { return html`
    <input type="checkbox" ${ todo.done ? 'checked' : '' }>
    <input type="text" class="desc" readonly value="${todo.desc}" />
    <button class="remove">${icons.remove}</button>
  `}

  init() {
    this.render()
    .on('change', '[type=checkbox]', e => this.toggleDone(e))
    .on('click', '.remove', e => this.publish('remove'))
    .on('dblclick', '.desc', e => this.edit(e))
    .on('keyup', '.desc', e => this.save(e))
    .on('focusout', '.desc', e => this.render())
  }

  edit(e) {
    e.target.removeAttribute('readonly')
    e.target.focus()
  }

  save(e) {
    if (e.keyCode == 13)
      this.set({ desc: e.target.value })
  }

  toggleDone(e) {
    this.set({ done: e.target.checked })
    this.publish('toggled')
  }
}

TodoItem.styles = csjs`
  :host {
    display: block;
    width: 100%;
    padding: 7px;
    background: white;
    border: 1px solid whitesmoke;
  }

  :host:hover,
  :host:hover .desc[readonly] {
    background: whitesmoke;
  }

  :host[done=true] .desc[readonly] {
    text-decoration: line-through;
  }

  :host:hover .remove {
    display: inline-block;
  }

  input.desc {
    width: 85%;
    font-size: 14px;
  }

  input.desc[readonly] {
    border: none;
  }

  input[type=checkbox] {
    width: 20px;
    height: 20px;
    position: relative;
    top: 5px;
  }

  .remove {
    display: none;
    background: transparent;
    font-size: 16px;
    border: none;
    padding: 4px;
    cursor: pointer;
    float: right;
    color: ${theme.red};
  }

  .remove:hover {
    color: ${theme.darkRed};
  }
`

TodoItem.register('todo-item')

HTMLComponent.booleanAttributes.push('done')
