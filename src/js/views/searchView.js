class SearchView {
  _parentEl = document.querySelector('.search');
  _actBtn = document.querySelector('.actbtn');
  _deactBtn = document.querySelector('.deactbtn');
  _overlay = document.querySelector('.overlay');
  _display = document.querySelector('.nav__btn--display');

  getQuery() {
    //reads search query
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  _toggleOn() {
    this._display.innerHTML = '';
    this._display.innerHTML = 'ON 🟢';
  }
  _toggleOff() {
    this._display.innerHTML = '';
    this._display.innerHTML = 'OFF 🔴';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      //adjusts active tab on Search
      const searchTab = document.getElementById('searchTab');
      const bindingTab = document.getElementById('bindingTab');
      searchTab.classList.remove('active');
      bindingTab.classList.remove('active');
      searchTab.classList.add('active');
      //uses controller.addHandlerSearch
      handler();
    });
  }

  addHandlerActivate(handler) {
    this._actBtn.addEventListener('click', function (e) {
      //uses controller.controlPlayerizer
      handler('.actbtn');
    });
    //toggles ON display
    this._actBtn.addEventListener('click', this._toggleOn.bind(this));
  }
  addHandlerDeactivate(handler) {
    //uses controller.controlPlayerizer
    this._deactBtn.addEventListener('click', function (e) {
      handler('.deactbtn');
    });
    //toggles OFF display
    this._deactBtn.addEventListener('click', this._toggleOff.bind(this));
  }
}
export default new SearchView();
