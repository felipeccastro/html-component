class TodoSummary extends HTMLComponent {

  template(props) { return html`
    <label class="items-left">
      ${props.active} ${props.active == 1 ? 'item' : 'items'} left
    </label>
    <section class="filters">
    ${ this.filters.map(filter => html`
      <button data-filter="${filter}" class="filter
        ${filter == props.filter ? 'selected' : '' }">
        ${filter}
      </button>
    `)}
    </section>
    <button class="clear-completed ${props.completed == 0 ? 'hidden' : ''}">
      Clear completed
    </button>
  `}

  get total() { return this.get('active') + this.get('completed') }
  get filters() { return [ 'all', 'active', 'completed' ] }

  init() {
    this.render()
    .on('click', '.filter', e => this.changeFilter(e))
    .on('click', '.clear-completed', e => this.publish('clear-completed'))
  }

  changeFilter(e) {
    var filter = e.target.dataset.filter
    this.set({ filter: filter })
    this.publish('change-filter', filter)
  }
}

TodoSummary.styles = csjs`
  :host {
    display: block;
    padding: 7px;
  }

  :host[active="0"][completed="0"] {
    display: none;
  }

  .items-left {
    display: inline-block;
    font-size: 15px;
    color: ${theme.gray};
  }

  .filters {
    margin-left: auto;
    margin-right: auto;
    width: 185px;
    margin-top: -19px;
  }

  .filter:first-letter {
    text-transform:capitalize;
  }

  .filter:focus {
    outline: none;
  }

  .filter.selected {
    border: 1px solid ${theme.lightRed};
  }

  button {
    cursor: pointer;
    border: none;
    background: white;
    font-size: 13px;
    color: ${theme.gray};
    border: 1px solid transparent;
  }

  button:hover {
    text-decoration: underline;
  }

  .clear-completed {
    float: right;
    margin-top: -23px;
  }
`

TodoSummary.register('todo-summary')
