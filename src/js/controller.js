import * as model from './model.js';
import { MODAL_CLOSE_SECS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //we can take a hash - from window object - and opened location
    const id = window.location.hash.slice(1);

    if (!id) return;

    /////----LOADING DATA FOR RECIPE FROM OPEN API----/////
    //loading - SPINNER
    recipeView.renderSpinner();

    //0 Update result view to mark updated search result
    // resultView.render(model.getSearchResultPage());
    resultView.update(model.getSearchResultPage());

    //Updating bookmarks
    bookmarkView.update(model.state.bookmarks);

    //loading recipe
    //await we need - because it is async function - calling another async func
    await model.loadRecipe(id);

    /////----RENDERING RECIPE IN OUR BROWSER APP----/////
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();

    // 1) Get search querry
    const query = searchView.getQuary();
    if (!query) return;

    //load search results
    await model.loadSearchResults(query);

    //render results
    // resultView.render(model.state.search.results);
    //model.getSearchResultPage() = model.getSearchResultPage(1)
    resultView.render(model.getSearchResultPage());

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //render new results
  // resultView.render(model.state.search.results);
  resultView.render(model.getSearchResultPage(goToPage));

  //render new pagination buttons
  paginationView.render(model.state.search);
};

//this are all actually handlers - will run with some event happens
const controlServings = function (newServings) {
  //update recipe servings number (in the state param)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  //we will update text only
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1 add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  //2 update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //Change ID in url by ---history--- WEB API -
    // .pushState() - TO CHANGE url without reloading page - it takes 3 arguments:
    //1-st argument --state-- not important could be null, 2-d : title,
    //3-d is most important - it is actual url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // window.history.back();//to go back to last page

    //close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECS * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const init = function () {
  bookmarkView.addRenderHandler(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  //functions often pass as argument in another functions
  paginationView.addClickHandler(controlPagination);
  addRecipeView.addUploadHandler(controlAddRecipe);
};

init();
