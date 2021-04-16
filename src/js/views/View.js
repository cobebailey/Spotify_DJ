import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  //renders data from the model
  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    //clear the html
    this._clear();
    //insert the markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //clears html
  _clear() {
    this._parentElement.innerHTML = '';
  }
  //renders a loading spinner
  renderSpinner() {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
      </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
            `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
