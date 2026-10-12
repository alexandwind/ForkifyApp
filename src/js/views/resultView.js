import View from './View.js';
import previewView from './previewView.js';

class resultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `We couldn't find that recipes for your query. Please try another one!`;
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
