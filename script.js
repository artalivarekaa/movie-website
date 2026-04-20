const API_URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=e8948658114c4433200a3a301ba98eb6&page=1";
const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280/";
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=e8948658114c4433200a3a301ba98eb6&query=';

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

// get movies
getMovies(API_URL);
async function getMovies(url) {
    const res = await fetch(url);
    const data= await res.json();
    displayMovies(data.results);
    console.log(data.results);
}

function displayMovies(movies) {
    main.innerHTML = '';
    movies.forEach((movie) => {
        const {title, poster_path, vote_average, overview} = movie;

        const moviesElement = document.createElement("div");
        moviesElement.classList.add("movie");

        moviesElement.innerHTML = `
            <img src="${poster_path ? IMAGE_PATH + poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${title}" />

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassesByRating(vote_average)}"> ${vote_average} </span>
            </div>
            <button class="fav-btn">❤️</button>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>  
        `;

        const favBtn = moviesElement.querySelector(".fav-btn");
        favBtn.addEventListener("click", () => {
            addToFavorites(movie);
            alert("Added to favorites!");
        });

        main.appendChild(moviesElement);
    });
}

function getClassesByRating(rating) {
    if(rating >= 8) {
        return "green";
    } else if(rating >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function addToFavorites(movie) {
    const favorites = getFavorites();
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue=search.value;
    if(searchValue && searchValue !== "") {
        getMovies(SEARCH_URL + searchValue);
        searchValue='';
    }else {
        window.location.reload();
    }
})