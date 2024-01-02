class MovieSpace
{
    constructor()
    {
        this.movieData = document.createElement("div");
        this.isMovieSelected = false;
        this.initMovieSearch();
        this.initMovieContent();
    }
   onInput = async event => {
        const inputElemnt = event.target;

        if(!inputElemnt.value.length) return;
        
        const data = await this.fetchData({s: inputElemnt.value});

        if(data.Error)
        {
            alert("No Movie Found in the search!!");
            return;
        }

        const movies = data.Search;
        const dropDown = inputElemnt.nextSibling;
        
        dropDown.innerHTML = "";
        dropDown.classList.add("show");
        
        for(let movie of movies)
        {
            const option = document.createElement("li");
            
            option.classList.add("dropdown-item");
            
            const moviePoster = movie.Poster === "N/A" ? "" : movie.Poster;
            
            option.innerHTML = `
                <img src="${moviePoster}">
                <span>${movie.Title}</span>
            `;

            option.addEventListener("click", (event) => {
                inputElemnt.value = movie.Title;
                dropDown.classList.remove("show");

                this.displayMovieContent(movie.imdbID);
            });

            dropDown.appendChild(option);
        }
    }

    initMovieSearch()
    {
        const {movieData} = this;

        const movieSearch = document.createElement("div");
        movieSearch.classList.add("movie-search");
        
        movieSearch.insertAdjacentHTML("afterbegin", "<h5>Search for Movies: </h5>")

        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.name = "movieName";
        searchInput.addEventListener("input", debounce(this.onInput));
        movieSearch.appendChild(searchInput);

        const dropDown = document.createElement("ul");
        dropDown.classList.add("dropdown-menu");
        movieSearch.appendChild(dropDown);

       document.addEventListener("click", event => {
            if(!movieSearch.contains(event.target))
            {
                dropDown.classList.remove("show");
            }
       });

       movieData.appendChild(movieSearch);
    }

    initMovieContent()
    {
        const {movieData} = this;

        movieData.insertAdjacentHTML("beforeend", "<div class='movie-content'></div>");
    }

    displayMovieContent = async movieID => {

        const movieDetails = await this.fetchData({i: movieID});

        if(movieDetails.Error)
        {
            alert("Cannot retrieve selected movie data!!!", movieDetails);
            return;
        }

        const movieContent = this.movieContent;
        movieContent.innerHTML = "";
        
        const movieHeader = document.createElement("div");
        movieHeader.classList.add("content-header");
        const moviePoster = movieDetails.Poster === "N/A" ? "" : movieDetails.Poster;

        movieHeader.innerHTML = `
            <img src="${moviePoster}"> 
            <div>
                <h1>${movieDetails.Title}</h1>
                <p>${movieDetails.Plot}</p>
                <p><strong>Genre:</strong> ${movieDetails.Genre}</p>
            </div>
        `;

        const movieStats = document.createElement("div");
        movieStats.classList.add("content-body");

        movieStats.insertAdjacentHTML("afterbegin", `
            <div class="card" style="width: 18rem;">
                <div class="card-body earning">
                    <h5 class="card-title">Box Office</h5>
                    <p class="card-text">${movieDetails.BoxOffice}</p>
                </div>
            </div>

            <div class="card" style="width: 18rem;">
                <div class="card-body rating">
                    <h5 class="card-title">Critic Details</h5>
                    <p class="card-text"><strong>Rating:</strong> ${movieDetails.imdbRating}</p>
                    <p class="card-text"><strong>Votes:</strong> ${movieDetails.imdbVotes}</p>
                </div>
            </div>
        `);

        this.boxOfficeValue = movieDetails.BoxOffice;
        this.rating = movieDetails.imdbRating;

        movieContent.append(movieHeader, movieStats);
        this.isMovieSelected = true;
    }

    setProcessing = status => {
        let htmlText = status ? '<div class="spinner-border text-primary" role="status"></div>' : "";
        this.movieContent.innerHTML = htmlText;
    }

    fetchData = async params => {
        
        this.setProcessing(true);
        
        const {data} = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: "59d97c4f",
                type: "movie",
                ...params
            }
        });
        
        this.setProcessing(false);

        return data;
    }

    get movieSpace()
    {
        return this.movieData;
    }

    get movieContent()
    {
        return this.movieData.querySelector(".movie-content");
    }
}



function debounce(callbackFunct, delay = 1000)
{
    let timeoutId;
    return (...args) => {
        if(timeoutId)
        {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            callbackFunct.apply(null, args);
        }, delay);
    };
}