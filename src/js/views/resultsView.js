import View from './View.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No playlists fizzound, try again';
  _message = '';

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    return `
    <li class="preview">
            <a class="preview__link" href="#p${result.id}">
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
