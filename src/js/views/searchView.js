class SearchView {
  _parentEl = document.querySelector('.search');
  _actBtn = document.querySelector('.actbtn');
  _deactBtn = document.querySelector('.deactbtn');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  addHandlerPlayerizer(handler) {
    this._actBtn.addEventListener('click', function (e) {
      handler();
    });
  }
  addHandlerDeactivate(handler) {
    this._deactBtn.removeEventListener('click', function (e) {
      handler();
    });
  }
}
export default new SearchView();
