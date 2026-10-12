class SearchView {
  _parentElement = document.querySelector('.search');

  getQuary() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  //we could pass in functions as arguments - searchHandler- should be -> controlSearchResults
  addHandlerSearch(searchHandler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      searchHandler();
    });
  }
}

export default new SearchView();
