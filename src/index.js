import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const divRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
    outputClear();
    if (e.target.value.trim() != '') {
        fetchCountries(e.target.value.trim())
            .then(makeHTML)
            .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        console.log(error);
        });
    }
};

function outputClear() {
    listRef.innerHTML = '';
    divRef.innerHTML = '';
};

function makeHTML(country) {
    if (country.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (country.length >= 2 && country.length <= 10){
        makeCountriesList(country);
    } else if (country.length === 1){
        makeCountryCard(country);
    } 
};

function makeCountriesList(countriesArray) {
    const markup = countriesArray.map(({ flags, name }) => {
        return `<li class="country-item">
        <img class="country-flag" src="${flags.svg}" width="40px">
        <p class="country-text">${name.official}</p>
        </li>`;
    }).join('');
    listRef.insertAdjacentHTML('beforeend', markup);
};

function makeCountryCard(country) {
    const markup = country.map(({ flags, name, capital, population, languages }) => {
        return `<div class="country-container"><img class="country-flag" src="${flags.svg}" width="80px">
        <p class="country-name">${name.official}<p></div>
        <p><span class="key-text">Capital:</span> ${capital}</p>
        <p><span class="key-text">Population:</span> ${population}</p>
        <p><span class="key-text">Languages:</span> ${Object.values(languages).join(', ')}</p>`;
    }).join('');
    divRef.insertAdjacentHTML('beforeend', markup);
}