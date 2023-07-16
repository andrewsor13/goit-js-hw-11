import '../css/style.css';
import { PixabayAPI } from './pixabay_api';
import Notiflix from 'notiflix';
import createGalleryTemplate from '../templates/cardGallery.hbs';
import SimpleLightboxPlugin from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();
const lightbox = new SimpleLightboxPlugin('.gallery a');

searchForm.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreButtonClick);

async function handleFormSubmit(event) {
  event.preventDefault();

  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  const form = event.currentTarget;
  const searchQuery = form.elements['searchQuery'].value.trim();
  pixabayAPI.q = searchQuery;

  if (!searchQuery) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  await searchGallery();
}

async function searchGallery() {
  try {
    const { data } = await pixabayAPI.fetchImgs();

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.innerHTML = createGalleryTemplate(data.hits);
    Notiflix.Notify.success(`We found ${data.totalHits} images.`);
    lightbox.refresh();

    if (data.totalHits > pixabayAPI.per_page) {
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleLoadMoreButtonClick() {
  pixabayAPI.page += 1;
  await searchLoadMoreImages();
}

async function searchLoadMoreImages() {
  try {
    const { data } = await pixabayAPI.fetchImgs();

    gallery.insertAdjacentHTML('beforeend', createGalleryTemplate(data.hits));
    lightbox.refresh();

    if (data.hits.length < pixabayAPI.per_page) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}
