class SearchView {
  _parentEl = document.querySelector('.search');
  _actBtn = document.querySelector('.actbtn');
  _deactBtn = document.querySelector('.deactbtn');
  _overlay = document.querySelector('.overlay');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  _toggleOverlay() {
    this._overlay.classList.toggle('hidden');
  }
  addHandlerShowOverlay() {
    this._actBtn.addEventListener('click', this._toggleOverlay.bind(this));
  }
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const searchTab = document.getElementById('searchTab');
      const bindingTab = document.getElementById('bindingTab');
      searchTab.classList.remove('active');
      bindingTab.classList.remove('active');
      searchTab.classList.add('active');
      handler();
    });
  }

  addHandlerActivate(handler) {
    this._actBtn.addEventListener('click', function (e) {
      handler('.actbtn');
      console.log('Playerizer activated...');
    });
  }
  addHandlerDeactivate(handler) {
    this._deactBtn.addEventListener('click', function (e) {
      handler('.deactbtn');
      console.log('Playerizer deactivated...');
    });
  }
}
export default new SearchView();
