// Fetch the Movie Data from the API
async function fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'f3ea3c53',
            s: searchTerm
        }
    });
    // Handle the error responses
    if (response.data.Error) {
        return [];
    }
    // Filter the response data to get only the info about movies
    return response.data.Search;
};

// Create an search-input element with dropdown feature
const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label><b>Search for a Movie</b><label/>
<input class='input' />
<div class='dropdown'>
<div class='dropdown-menu'>
<div class='dropdown-content results'></div>
</div>
</div>
`;
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

// Delay the search input
// List the movies in the dropdown menu after searching
const input = document.getElementById('input');
async function onInput(event) {
    const movies = await fetchData(event.target.value)

    dropdown.classList.add('is-active');

    for (let movie of movies) {
        const option = document.createElement('a');
        option.classList.add('dropdown-item')
        option.innerHTML =
            `<img src="${movie.Poster}" />
            ${movie.Title}
            `;

        resultsWrapper.appendChild(option);
    }
};

input.addEventListener('input', debounce(onInput, 500));