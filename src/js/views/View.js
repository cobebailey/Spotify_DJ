import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  //renders data from the model
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
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
  //
  //
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    //creates a virtual dom for comparing old dom to new dom
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //arrays for comapring
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  //
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
  renderDefault(message = this._defaultMessage) {
    const markup = `
    <div class="default">
              
              <p>${message}</p>
            </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
