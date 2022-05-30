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
    // Select the movie
    onOptionSelect(movie) {
        onMovieSelect(movie);
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
    root: document.querySelector('#left-autocomplete')
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete')
});

// Fetch the selected movie
async function onMovieSelect(movie) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'f3ea3c53',
            i: movie.imdbID
        }
    })
    document.querySelector('.summary').innerHTML = movieTemplate(response.data);
}

// Render the selected movie
function movieTemplate(movieDetail) {
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
   <article class="notification is-primary">
     <p class="title">${movieDetail.Awards}</p>
     <p class="subtitle">Awards</p>
   </article>
   <article class="notification is-primary">
     <p class="title">${movieDetail.BoxOffice}</p>
     <p class="subtitle">Box Office</p>
   </article>
   <article class="notification is-primary">
     <p class="title">${movieDetail.Metascore}</p>
     <p class="subtitle">Metascore</p>
   </article>
   <article class="notification is-primary">
     <p class="title">${movieDetail.imdbRating}</p>
     <p class="subtitle">IMDB Rating</p>
   </article>
   <article class="notification is-primary">
     <p class="title">${movieDetail.imdbVotes}</p>
     <p class="subtitle">IMDB Votes</p>
   </article>
 `;
}

