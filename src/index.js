import './css/styles.css';
import debounce from "lodash.debounce";
import Notiflix from "notiflix";
import fetchCountries from "./fetchCountries";

const DEBOUNCE_DELAY = 300;

const search = document.getElementById("search-box");
const list = document.querySelector(".country-list");
const info = document.querySelector(".country-info");

function clearMarkup() {
    list.innerHTML = "";
    info.innerHTML = "";
}

function createMarkup(data) {
    let markup = "";
    if (data.length === 0) {
        clearMarkup();
    } else if (data.length === 1) {
        clearMarkup();
        const { name, capital, population, flags, languages } = data[0];
        console.log(name.official, ...capital, population, flags.svg, ...Object.values(languages));
        markup = `<p class="country_name">
                    <img src="${flags.svg}" alt="${flags.alt}" width="45px" height="30px"/>
                    <b>${name.official}</b> 
                  </p>
                  <p class="country_descr"><b>Capital:</b> ${capital}</p>
                  <p class="country_descr"><b>Population:</b> ${population}</p>
                  <p class="country_descr"><b>Languages:</b> ${Object.values(languages)}</p>`;
        info.innerHTML = markup;
    } else {
        console.log(data);
        clearMarkup();
        markup = data.map(({ name, flags }) => {
            return `<li class="country_item">
                    <img src="${flags.svg}" alt="${flags.alt}" width="30px" height="20px"/>
                    ${name.official}
                  </li>`
        }).join('');
        list.innerHTML = markup;
    };
};

function onInput(event) {
    if (event.target.value.trim().length === 0) return clearMarkup();
    console.log(event.target);
    console.log(event.target.value);
    console.log(event.target.value.length);
    fetchCountries(event.target.value.trim())
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.status);
            }
            return response.data;
        })
        .then(data => {
            // Data handling
            if (data.length > 10) {
                clearMarkup();
                return Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);;
            };
            console.log(data);
            createMarkup(data);
        })
        .catch(error => {
            // Error handling
            console.log(error);
        });
};

search.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

console.log(search);
console.log(list);
console.log(info);