function createAutoComplete({ root, renderOption }) {

    // Create a search-input element with dropdown feature
    root.innerHTML = `
    <label><b>Search for a Movie</b><label/>
    <input class='input' />
    <div class='dropdown'>
        <div class='dropdown-menu'>
            <div class='dropdown-content results'></div>
        </div>
    </div>
`;
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    // Delay the search input
    // List the movies in the dropdown menu after searching
    const input = root.querySelector('input');
    async function onInput(event) {
        const movies = await fetchData(event.target.value)

        // Remove dropdown if there's no movie in the input
        if (!movies.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        // Activate dropdown menu
        dropdown.classList.add('is-active');

        // List the movies in the input
        for (let movie of movies) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item')
            option.innerHTML = renderOption(movie);

            // Select the movie
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = movie.Title
                onMovieSelect(movie);
            })
            resultsWrapper.appendChild(option);
        }
    };

    input.addEventListener('input', debounce(onInput, 500));

    // Close the dropdown if there's a click outside the dropdown
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active')
        }
    });
}

