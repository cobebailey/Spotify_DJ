import View from './View.js';
import icons from 'url:../../img/icons.svg';
class BindingsView extends View {
  _parentElement = document.querySelector('.tab');
  _searchElement = document.querySelector('.results');
  _errorMessage = 'binding error';
  _message = '';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.tablinks');
      console.log(btn);
      if (!btn) return;
      const id = btn.id;
      console.log(id);
      handler(id);
    });
  }
  //special, targets .results instead of parent EL
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    //clear the html
    this._clear();
    //insert the markup
    this._searchElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._searchElement.innerHTML = '';
  }
  //

  _generateMarkup() {
    console.log(this._data, 'tabview');
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    return `
    <li class="preview">
            <a class="preview__link" href="#p${result.track.id}">
              <figure class="preview__fig">
                <img src="" alt="${result.keyName}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.keyName} : ${result.track.name}</h4>
                <p class="preview__publisher">${result.track.owner.displayName}</p>
                
              </div>
            </a>
          </li>
    `;
  }
}

export default new BindingsView();
