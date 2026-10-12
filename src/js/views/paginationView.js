import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addClickHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      //.closest - for searching down in the tree, for all children up in the tree near parent
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    console.log(numPages);

    //We are at the page 1 = there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto = '${currentPage + 1}' class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    //We are at the last page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto = '${currentPage - 1}' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
      `;
    }

    //We are at the some page not 1 and not last
    if (currentPage < numPages) {
      return `
          <button data-goto = '${currentPage - 1}' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          <button data-goto = '${currentPage + 1}' class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
         </button>
      `;
    }

    //We are at the page 1 = there are no other pages
    return ``;
  }
}

export default new PaginationView();
