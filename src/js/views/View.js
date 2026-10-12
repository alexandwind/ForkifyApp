//Parent class for all views
export default class View {
  _data;

  render(data, render = true) {
    //Double check in --> ()
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();
    ///newDOM will become new obj like virtual DOM and we could use it like real one
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*'),
    );

    newElements.forEach((newElem, i) => {
      const currentElem = currentElements[i];
      // console.log(currentElem, newElem.isEqualNode(currentElem));

      //updates change text
      if (
        !newElem.isEqualNode(currentElem) &&
        newElem.firstChild?.nodeValue.trim() !== ''
      ) {
        currentElem.textContent = newElem.textContent;
      }

      //update change attributes
      if (!newElem.isEqualNode(currentElem))
        // Array.from(something); - we making somethinf an array
        Array.from(newElem.attributes).forEach(attribute =>
          currentElem.setAttribute(attribute.name, attribute.value),
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
  <div class="spinner">
          <svg>
            <use href="src/img/icons.svg#icon-loader"></use>
          </svg>
        </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="src/img/icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="src/img/icons.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
