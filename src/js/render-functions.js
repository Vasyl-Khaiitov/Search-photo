import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = null;

export function clearGallery() {
  gallery.innerHTML = '';
}
// Все в одній
export function updateGallery(hits) {
  markupPhoto(hits);
}

export function showButton() {
  btnMore.classList.remove('hidden');
}

export function hideButton() {
  btnMore.classList.add('hidden');
}

const gallery = document.querySelector('.gallery');
export const btnMore = document.querySelector('.btn-more');

export function markupPhoto(hits = []) {
  const galleryMarkup = hits
    .map(
      hit =>
        `<li class="gallery-item">
        <a href="${hit.largeImageURL}" class="gallery-item-link">
        <img class="gallery-img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        </a>
        <div class="text-info">
        <p><b>Likes:</b>${hit.likes}</p>
        <p><b>Views:</b>${hit.views}</p>
        <p><b>Comments:</b>${hit.comments}</p>
        <p><b>Downloads:</b>${hit.downloads}</p>
        </div>
        </li>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', galleryMarkup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      caption: true,
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}
