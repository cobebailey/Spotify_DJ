import View from './View.js';

import icons from 'url:../../img/icons.svg';
class PlaylistView extends View {
  _parentElement = document.querySelector('.playlist');
  _bindBtnElement = document.querySelector('.bindbtn');
  _display = document.querySelector('.nav__btn--display');
  _bindingMessage = document.querySelector('.playlist__details');

  _errorMessage = 'uh oh...';

  addHandlerRender(handlerFunction) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handlerFunction)
    );
  }

  //generates an html script using data from the model to display playlist
  _generateMarkup() {
    console.log(this._data);
    return ` 
    <figure class="playlist__fig">
      <img src="${this._data.playlist.image.url}" alt="${
      this._data.name
    }" class="playlist__img" />
      <h1 class="playlist__title">
        <span>${this._data.playlist.name}</span>
      </h1>
    </figure>

    <div class="playlist__details">
      <div class="playlist__info">
        <svg class="playlist__info-icon">
          <use href=${icons}#icon-clock"></use>
        </svg>
        <span class="playlist__info-data playlist__info-data--minutes">${
          this._data.playlist.description
        }</span>
        <span class="playlist__info-text"></span>
      </div>
      <!--
      <div class="playlist__info">
        <svg class="playlist__info-icon">
          <use href=${icons}#icon-users"></use>
        </svg>
        <span class="playlist__info-data playlist__info-data--people">-</span>
        <span class="playlist__info-text">ph</span>

        <div class="playlist__info-buttons">
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
      
      <!-- little buitton by desc
      <button class="btn--round">
        <svg class="">
          <use href=${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
      -->
    </div>

    <div class="playlist__track">
      <h2 class="heading--2">Tracks</h2>
      <ul class="playlist__track-list">
      <!-- iterates over a playlist to display tracks -->
      ${this._data.trackPage
        .map(track => {
          return `<li class="preview">
          <a class="preview__link preview__link--active" href="#t${
            track.track === null ? 'error fetching...' : track.track.id
          }">
            <figure class="preview__fig">
              <img src="${
                track.track === null ? 'error' : track.track.album.images[0].url
              }" alt="Not Found" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${
                track.track === null ? 'error fetching...' : track.track.name
              }</h4>
              <p class="preview__publisher">${
                track.track === null ? 'error' : track.track.artists[0].name
              }</p>
              

              
            </div>
          </a>
          <a class="preview__bind" href="#b${
            track.track === null ? 'error' : track.track.id
          }">
            <button class="btn--tinyhover bindbtn" id="${
              track.track === null ? 'error' : track.track.id
            }" >BIND</button>
          </a>
          

          
        </li>
          
          
          `;
        })
        .join(' ')}
      </div>
      
      

      
        
   
`;
  }
}

export default new PlaylistView();
