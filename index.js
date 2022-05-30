// Necessary functions collection for createAutoComplete
const autoCompleteConfig = {
    // List the movies
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
            `;
    },
    inputValue(movie) {
        return movie.Title
    },
    // Fetch the Movie Data from the API
    async fetchData(searchTerm) {
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
    }
}

// Activate the autocomplete for right and left columns
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    // Select the movie
    onOptionSelect(movie) {
        // Hide the tutorial
        document.querySelector('.tutorial').classList.add('is-hidden')
        // Show the movie summary
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    // Select the movie
    onOptionSelect(movie) {
        // Hide the tutorial
        document.querySelector('.tutorial').classList.add('is-hidden')
        // Show the movie summary
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

let leftMovie;
let rightMovie;
// Fetch the selected movie
async function onMovieSelect(movie, summaryElement, side) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'f3ea3c53',
            i: movie.imdbID
        }
    })
    summaryElement.innerHTML = movieTemplate(response.data);
    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }
    // Start Comparison
    if (leftMovie && rightMovie) {
        runComparison();
    }
    function runComparison() {
        const leftSideStats = document.querySelectorAll('#left-summary .notification');
        const rightSideStats = document.querySelectorAll('#right-summary .notification');

        leftSideStats.forEach((leftStat, index) => {
            const rightStat = rightSideStats[index];
            const leftSideValue = parseInt(leftStat.dataset.value);
            const rightSideValue = parseInt(rightStat.dataset.value);

            if (rightSideValue > leftSideValue) {
                leftStat.classList.remove('is-primary');
                leftStat.classList.add('is-warning');
            } else {
                rightStat.classList.remove('is-primary');
                rightStat.classList.add('is-warning');
            }
        });
    };
};

// Render the selected movie
function movieTemplate(movieDetail) {
    // Transform the data into numbers to easily compare
    const boxOffice = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split('').reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);

    return `
   <article class="media">
     <figure class="media-left">
       <p class="image">
         <img src="${movieDetail.Poster}" />
       </p>
     </figure>
     <div class="media-content">
       <div class="content">
         <h1>${movieDetail.Title}</h1>
         <h4>${movieDetail.Genre}</h4>
         <p>${movieDetail.Plot}</p>
       </div>
     </div>
   </article>
   <article data-value=${awards} class="notification is-primary">
     <p class="title">${movieDetail.Awards}</p>
     <p class="subtitle">Awards</p>
   </article>
   <article data-value=${boxOffice} class="notification is-primary">
     <p class="title">${movieDetail.BoxOffice}</p>
     <p class="subtitle">Box Office</p>
   </article>
   <article data-value=${metascore} class="notification is-primary">
     <p class="title">${movieDetail.Metascore}</p>
     <p class="subtitle">Metascore</p>
   </article>
   <article data-value=${imdbRating} class="notification is-primary">
     <p class="title">${movieDetail.imdbRating}</p>
     <p class="subtitle">IMDB Rating</p>
   </article>
   <article data-value=${imdbVotes} class="notification is-primary">
     <p class="title">${movieDetail.imdbVotes}</p>
     <p class="subtitle">IMDB Votes</p>
   </article>
 `;
}

