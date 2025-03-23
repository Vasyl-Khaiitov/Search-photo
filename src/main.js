import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { requestServer } from './js/pixabay-api';
import {
  clearGallery,
  updateGallery,
  hideLoader,
  showLoaderBottom,
  showLoaderTop,
  showButton,
  hideButton,
  btnMore,
} from './js/render-functions';

const form = document.querySelector('.form');

btnMore.addEventListener('click', onClick);
form.addEventListener('submit', onSubmit);

let correctValueText = null;
let currentPage = 1;

export async function onSubmit(event) {
  event.preventDefault();

  currentPage = 1;
  clearGallery();
  const form = event.currentTarget;

  const { searchText } = form.elements;
  correctValueText = searchText.value.trim();

  if (!correctValueText) {
    iziToast.show({
      title: '⛔',
      message: 'Please write a search query!',
      color: 'yellow',
      position: 'topRight',
    });
    return;
  }

  showLoaderTop();
  hideButton();

  try {
    const { hits, totalHits } = await requestServer(
      correctValueText,
      currentPage
    );

    if (!Array.isArray(hits)) {
      console.error('Invalid response structure. Hits is not an array.');
      iziToast.show({
        title: '⚠️',
        message: 'Unexpected response format. Please try again later!',
        color: 'yellow',
        position: 'topRight',
      });
      hideLoader();
      return;
    }

    if (hits.length === 0) {
      iziToast.show({
        title: '❌',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        color: 'red',
        position: 'topRight',
      });
      hideLoader();
      return;
    }

    updateGallery(hits);

    if (hits.length < totalHits) {
      showButton();
    } else {
      hideButton();
    }

    form.reset();
  } catch (error) {
    let errorMessage = 'An unexpected error occurred. Please try again later!';

    if (error.response) {
      errorMessage = `Server Error: ${
        error.response.data.message || error.message
      }`;
    } else if (error.request) {
      errorMessage =
        'Network Error: Failed to reach the server. Please check your internet connection.';
    }

    iziToast.show({
      title: '⚠️',
      message: errorMessage,
      color: 'red',
      position: 'topRight',
    });
    console.error('Error:', error.message);
  }
  hideLoader();
}

async function onClick(event) {
  currentPage += 1;

  showLoaderBottom();

  try {
    const { hits, totalHits } = await requestServer(
      correctValueText,
      currentPage
    );
    console.log(hits, totalHits);

    if (hits.length === 0) {
      hideButton();
    } else {
      updateGallery(hits);

      const displayedCards = currentPage * 15;

      if (displayedCards >= totalHits) {
        iziToast.show({
          title: 'ℹ️',
          message: "We're sorry, but you've reached the end of search results",
          color: 'blue',
          position: 'topRight',
        });
        hideButton();
      }
    }
  } catch (error) {
    console.error('Error during fetching data:', error.message);
    iziToast.show({
      title: '⚠️',
      message: 'An error occurred. Please try again later!',
      color: 'red',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}
