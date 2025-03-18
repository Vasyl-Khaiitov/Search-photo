
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


import { requestServer } from "./js/pixabay-api";
import { markupPhoto } from "./js/render-functions";

let lightbox = null;

const form = document.querySelector('.form');
const loader = document.querySelector('.loader');
form.addEventListener('submit', onSubmit);


export function onSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const { searchText } = form.elements;
    const correctValueText = searchText.value.trim();

    if (!correctValueText) {
        iziToast.show({
            title: "⛔",
            message: 'Please write a search query!',
            color: 'yellow',
            position: "topRight"
        });
        return;
    }

    loader.classList.remove("hidden");

    requestServer(correctValueText)
        .then(hits => {

            if (!Array.isArray(hits)) {
                console.error("Invalid response structure. Hits is not an array.");
                iziToast.show({
                    title: "⚠️",
                    message: 'Unexpected response format. Please try again later!',
                    color: 'red',
                    position: "topRight"
                });
                return;
            }


            if (hits.length === 0) {
                iziToast.show({
                    title: "❌",
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    color: 'red',
                    position: "topRight"
                });
                loader.classList.add("hidden");
                return;
            }

            markupPhoto(hits);
            
            if (!lightbox) {
                lightbox = new SimpleLightbox(".gallery a", {
                    caption: true,
                    captionType: "attr",
                    captionsData: "alt",
                    captionPosition: "bottom",
                    captionDelay: 250
                });
            } else {
                lightbox.refresh();
            }

            form.reset();
        })
        .catch(error => {
               let errorMessage = 'An unexpected error occurred. Please try again later!';
            if (error.response) {
                errorMessage = `Server Error: ${error.response.data.message || error.message}`;
            } else if (error.request) {
                errorMessage = 'Network Error: Failed to reach the server. Please check your internet connection.';
            }

            iziToast.show({
                title: "⚠️",
                message: errorMessage,
                color: 'red',
                position: "topRight"
            });
            console.error("Error:", error.message);
        })
        .finally(() => {
            loader.classList.add("hidden");
        });
}

