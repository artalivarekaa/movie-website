const API_URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=e8948658114c4433200a3a301ba98eb6&page=1";
const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280/";
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=e8948658114c4433200a3a301ba98eb6&query=';

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");
const favoritesContainer = document.getElementById("favorites");

function showFavorites() {
    if (!favoritesContainer) return;

    const favorites = getFavorites();

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="empty-favorites">
                <p>No favorites yet ❤️</p>
                <span>Click the heart icon to add movies</span>
            </div>
        `;
        return;
    }

    favoritesContainer.innerHTML = '';

    favorites.forEach((movie) => {
        //object destructuring
        const { title, poster_path, vote_average, overview } = movie;

        const favElement = document.createElement("div");
        favElement.classList.add("movie");
        // if poster path exists, use it; otherwise, use a placeholder image
        favElement.innerHTML = `
            <img src="${poster_path ? IMAGE_PATH + poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassesByRating(vote_average)}">${vote_average}</span>
            </div>

            <button class="remove-btn">❌</button>

            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `;

        favoritesContainer.appendChild(favElement);

        const removeBtn = favElement.querySelector(".remove-btn");
        removeBtn.addEventListener("click", () => {
            removeFromFavorites(movie.id);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getMovies(API_URL);
    showFavorites();

    $("#favorites").hide();
    $("#toggle-fav").text("Show Favorites ❤️");
});

async function getMovies(url) {
    main.innerHTML = "<p>Loading movies...</p>";
    const res = await fetch(url);
    const data= await res.json();

    if (!data.results.length) {
        main.innerHTML = "<p>No movies found.</p>";
        return;
    }

    displayMovies(data.results);
    // console.log(data.results);
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
            // alert("Added to favorites!");
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
    // favorites.push(movie); avoiding adding duplicates by checking if the movie already exists in favorites
    const exists = favorites.some(fav => fav.id === movie.id);
    if (!exists) {
        favorites.push(movie);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        showFavorites();
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue=search.value;
    if(searchValue && searchValue !== "") {
        getMovies(SEARCH_URL + searchValue);
        search.value ='';
    }else {
        window.location.reload();
    }
})


function removeFromFavorites(id) {
    let favorites = getFavorites();

    favorites = favorites.filter(movie => movie.id !== id);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    showFavorites();
}


$("#toggle-fav").click(function () {

    const willShow = $("#favorites").is(":hidden");

    $("#favorites").stop(true, true).fadeToggle(300);

    $(this).text(willShow ? "Hide Favorites ❤️" : "Show Favorites ❤️");

    $("#favorites").toggleClass("active-favorites");

    if (willShow) {
        $("html, body").animate({
            scrollTop: $("#favorites").offset().top
        }, 400);
    }
});


$("#theme-toggle").click(function () {
    $("body").toggleClass("dark");

    $(this).text(function (_, text) {
        return text === "Switch to Dark Mode 🌙"
            ? "Switch to Light Mode ☀️"
            : "Switch to Dark Mode 🌙";
    });
});
