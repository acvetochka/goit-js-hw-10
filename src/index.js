import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const container = document.querySelector('.country-info');

const onInput = debounce(evt => {
  const name = evt.target.value.trim();
  if (!name) {
    return (container.innerHTML = '');
  }
  fetchCountries(name)
    .then(choiceCountry)
    .catch(error => console.log(error));
}, DEBOUNCE_DELAY);

function choiceCountry(countries) {
  const arrLength = countries.length;
  if (arrLength > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return (container.innerHTML = '');
  }
  if (arrLength === 1) {
    return renderCountryInfo(countries);
  }
  if (arrLength > 1) {
    return renderCountriesAll(countries);
  }
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(country => {
      return `<div class="country">
      <img src="${country.flags.svg}" width="50" height="30" alt="flag of ${
        country.name.official
      }">
      <h2 class="country-title">${country.name.official}</h2></div>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)}</p>`;
    })
    .join('');
  container.innerHTML = markup;
}

function renderCountriesAll(countries) {
  const markup = countries
    .map(country => {
      return `<div class="country">
      <img src="${country.flags.svg}" width="50" height="30" alt="flag of ${country.name.official}">
      <p>${country.name.official}</p></div>`;
    })
    .join('');
  container.innerHTML = markup;
}

input.addEventListener('input', onInput);
