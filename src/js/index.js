import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';

const selectEl = document.querySelector('.breed-select');
const infoEl = document.querySelector('.cat-info');
const loaderText = document.querySelector('.loader');
const errorText = document.querySelector('.error');

axios.defaults.headers.common['x-api-key'] =
  'live_9jwjpGGk82caOs49mWbvkGiQVt1QVnURDPnZvHLqAyFlQysDgMSpJdpWqxzinfUn';

fillList();

function showElement(element) {
  element.classList.remove('invisible');
}

function hideElement(element) {
  element.classList.add('invisible');
}

function showLoader() {
  showElement(loaderText);
  hideElement(selectEl);
  hideElement(infoEl);
  hideElement(errorText);
}

function hideLoader() {
  hideElement(loaderText);
  showElement(selectEl);
  showElement(infoEl);
}

function showError() {
  showElement(errorText);
}

function hideError() {
  hideElement(errorText);
}

async function fillList() {
  try {
    showLoader();
    hideError();

    const data = await fetchBreeds();
    const breedList = data.map(
      ({ name, id }) => `<option value="${id}">${name}</option>`
    );

    selectEl.innerHTML = breedList;
    showElement(selectEl);
    hideLoader();
  } catch (error) {
    hideLoader();
    showError();
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  }
}

selectEl.addEventListener('change', async () => {
  try {
    showLoader();
    hideError();
    clearCatCard();

    const value = selectEl.value;
    const name = selectEl.options[selectEl.selectedIndex].text;

    const catData = await fetchCatByBreed(value);
    createCatCard(catData, name);

    hideLoader();
  } catch (error) {
    hideLoader();
    showError();
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  }
});

function createCatCard(cats, title) {
  const cat = cats[0];

  const markup = `
    <div>
      <img src="${cat.url}" class="cat-img" alt="cat">
    </div>
    <div>
      <h2>${title}</h2>
      <p>${cat.breeds[0].description}</p>
      <h3>Temperament</h3>
      <p class="cat-temp">${cat.breeds[0].temperament}</p> 
    </div> 
  `;
  infoEl.innerHTML = markup;
  showElement(infoEl);
}

function clearCatCard() {
  infoEl.innerHTML = '';
}
