import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input',debounce(onInput,DEBOUNCE_DELAY));

function onInput(){
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    const inputValue = searchInput.value.trim();

    checkAvailableData(inputValue);
}

function checkAvailableData(country) {
    fetchCountries(country)
        .then(data => {
            if (data.length > 10) {
                return Notify.info('Too many matches found. Please enter a more specific name.')
            }
            else if (data.length >= 2 && data.length <= 10) {
                return createMarkupForCountries(data);
            }
            else {
                return createMarkupForCountry(data);
            }
        })
        .catch(() => {
            return Notify.failure('Oops, there is no country with that name');
        })
}

function createMarkupForCountries(countries) {
     countryList.innerHTML = '';
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    })
    .join('');
  return countryList.insertAdjacentHTML('beforeend', markup);
}

function createMarkupForCountry(country) {
  countryInfo.innerHTML = '';

  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `
  <div class="country__flag">
    <img class="country__img" src="${flags.svg}" alt="flag">
    <p class="country__name">${name.official}</p>
  </div>
  <ul class="country__info">
      <li class="country__item"> <b>Capital</b>:
    <span class="country__span">${capital}</span>
      </li>
      <li class="country__item"> <b>Population</b>:
    <span class="country__span">${population}</span>
      </li>
      <li class="country__item"> <b>Languages</b>:
    <span class="country__span">${Object.values(languages).join(', ')}</span>
      </li>
  </ul>`;
    })
    .join('');

  countryInfo.insertAdjacentHTML('beforeend', markup);
}
 

