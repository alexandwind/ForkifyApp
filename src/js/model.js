import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helperFunctions.js';
import { AJAXRequest } from './helperFunctions.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (fetchedData) {
  const { recipe } = fetchedData.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const fetchedData = await AJAXRequest(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(fetchedData);

    // const { recipe } = fetchedData.data;

    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    //Temporary error handler
    console.error(`${err} 🤔`);
    throw err; //to move it to next async promise func in a controller
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const fetchedData = await AJAXRequest(
      `${API_URL}?search=${query}&key=${KEY}`,
    );
    console.log(fetchedData);

    state.search.results = fetchedData.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🤔`);
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  //we need array elems first 10
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    //newQt = oldQt * newServ / oldServ
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

//Local storage implementation
const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //Calling localstorage
  storeBookmarks();
};

//if we want to remove something we just get id
export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(elem => elem.id === id);
  // .splice - to delete data from array: index -from where -and how many elems
  state.bookmarks.splice(index, 1);

  //Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //Calling localstorage
  storeBookmarks();
};

const localStorageInit = function () {
  const storage = localStorage.getItem('bookmarks');

  //.parse - will convert string back to the object
  if (storage) state.bookmarks = JSON.parse(storage);
};

localStorageInit();

// const removeBookmarks = function () {
//   localStorage.clear('bookmarks');
// };

// removeBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    //each element of array is an entry
    //conditions of filtering and making new arr
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        // const ingredientsArr = ingredient[1].replaceAll(' ', '').split(',');
        const ingredientsArr = ingredient[1]
          .split(',')
          .map(elem => elem.trim());
        if (ingredientsArr.length !== 3)
          throw new Error('Wrong ingredient format');

        //.replaceAll(conditions), then return array with --> .split
        const [quantity, unit, description] = ingredientsArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    /// --> ? --> TO SPESHIFY LIST OF PARAMETERS

    const sendData = await AJAXRequest(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(sendData);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
