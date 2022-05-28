
// api key: f3ea3c53

// Fetch the Movie Data from the API
async function fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'f3ea3c53',
            s: searchTerm
        }
    });
    console.log(response.data);
};

function onInput(event) {
    setTimeout(() => {
        fetchData(event.target.value)
    }, 1000)
}

const input1 = document.getElementById("input1");
input1.addEventListener('input', onInput);