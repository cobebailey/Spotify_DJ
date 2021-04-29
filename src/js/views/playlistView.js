import View from './View.js';

import icons from 'url:../../img/icons.svg';
class PlaylistView extends View {
  _parentElement = document.querySelector('.recipe');

  _errorMessage = 'uh oh...';

  //used in init() to add event listeners for playlist loading

  //used in init() to add event listeners to hashchanges for play tracks
  addTrackPlayer(handlerFunction) {
    window.addEventListener('hashchange', event => {
      event.preventDefault();
      handlerFunction();
    });
  }
  addHandlerRender(handlerFunction) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handlerFunction)
    );
  }

  //generates an html script using data form the model to display playlist
  _generateMarkup() {
    console.log(this._data);
    return ` 
    <figure class="recipe__fig">
      <img src="${this._data.playlist.image.url}" alt="${
      this._data.name
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.playlist.name}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href=${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.playlist.description
        }</span>
        <span class="recipe__info-text"></span>
      </div>
      <!--
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href=${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">-</span>
        <span class="recipe__info-text">ph</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href=${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href=${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
      -->
      <!-- shadow?
      <div class="recipe__user-generated">
        <svg>
          <use href=${icons}#icon-user"></use>
        </svg>
      </div>
      -->
      <!-- little buitton by desc
      <button class="btn--round">
        <svg class="">
          <use href=${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
      -->
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Tracks</h2>
      <ul class="recipe__ingredient-list">
      <!-- iterates over a playlist to display tracks -->
      ${this._data.trackPage
        .map(track => {
          return `<li class="preview">
          <a class="preview__link preview__link--active" href="#t${track.track.id}">
            <figure class="preview__fig">
              <img src="${track.track.album.images[0].url}" alt="Test" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${track.track.name}</h4>
              <p class="preview__publisher">${track.track.artists[0].name}</p>
              <div class="preview__user-generated">
                <svg>
                  <use href="src/img/icons.svg#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>
          
          
          `;
        })
        .join(' ')}
      </div>
      
      

      
        
    <!--
    <div class="recipe__directions">
      <h2 class="heading--2">ph</h2>
      <p class="recipe__directions-text">
        Playlist by:
        <span class="recipe__publisher">${
          this._data.playlist.owner.displayName
        }</span>. PH
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.playlist.href}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href=${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
    -->
`;
  }
}

export default new PlaylistView();

{
  /* <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href=${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${track.track.name} - </div>
        <div class="recipe__description">
          <span class="recipe__unit">${track.track.artists[0].name}</span>
          PH
        </div>
      </li> */
}
