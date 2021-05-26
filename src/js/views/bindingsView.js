import View from './View.js';
import icons from 'url:../../img/icons.svg';
class BindingsView extends View {
  _parentElement = document.querySelector('.tab');
  _searchElement = document.querySelector('.results');
  _errorMessage = 'No key-bindings found....';
  _message = '';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const searchTab = document.getElementById('searchTab');
      const bindingTab = document.getElementById('bindingTab');
      searchTab.classList.remove('active');
      bindingTab.classList.remove('active');

      const btn = e.target.closest('.tablinks');
      btn.classList.add('active');

      if (!btn) return;
      const id = btn.id;

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
    let dataArray = this._data;

    /* dataArray = dataArray.map(function (el, i) {
      el.keyName = `${String.fromCharCode(65 + i)}`;
      i++;
      return el;
    }); */

    let dataHTML = dataArray.map(this._generateMarkupPreview).join('');
    return dataHTML;
  }

  _generateMarkupPreview(track) {
    return `
    <li class="preview">
            <a class="preview__link" href="#t${track.id}">
              <figure class="preview__fig">
                <img src="${track.album.images[0].url}" alt="${track.keyName[3]}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${track.keyName[3]} : ${track.name}</h4>
                <p class="preview__publisher">by: ${track.artists[0].name}</p>
                
              </div>
            </a>
          </li>
    `;
  }
}

export default new BindingsView();
