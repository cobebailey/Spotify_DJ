import View from './View.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    return `
    <li class="preview">
            <a class="preview__link" href="#p${result.id}">
              <figure class="preview__fig">
                <img src="${result.image.url}" alt="Failed image load" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.name}</h4>
                <p class="preview__publisher">${result.owner.displayName}</p>
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
    `;
  }
}

export default new ResultsView();
