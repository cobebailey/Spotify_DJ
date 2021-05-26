import View from './View.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No playlists found, try again';
  _defaultMessage = 'Try searching for a playlist';
  _message = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
            <a class="preview__link ${
              result.id === id ? 'preview__link--active' : ''
            }" href="#p${result.id}">
              <figure class="preview__fig">
                <img src="${result.image.url}" alt="${result.name}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.name}</h4>
                <p class="preview__publisher">${result.owner.displayName}</p>
                
              </div>
            </a>
          </li>
    `;
  }
}

export default new ResultsView();
