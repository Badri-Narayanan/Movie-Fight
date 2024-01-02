function getComparisonStatus(value1, value2)
{
    console.log("Comparing : ", value1, value2);
    if(value1 === "N/A" || value2 === "N/A" || value1 === value2) 
        return ["lightgrey", "lightgrey"];

    return (value1 > value2) ? ["lightgreen", "lightcoral"] : ["lightcoral", "lightgreen"];
}


const movieSpace = document.querySelector(".movie-space");

const movieSearch1 = new MovieSpace();
const movieSearch2 = new MovieSpace();

movieSpace.append(movieSearch1.movieSpace, movieSearch2.movieSpace);

const intervalId = setInterval(() => {
    if(!movieSearch1.isMovieSelected || !movieSearch2.isMovieSelected) return;

    clearInterval(intervalId);
    const boxOfficeElemnt1 = movieSearch1.movieSpace.querySelector(".earning");
    const boxOfficeElemnt2 = movieSearch2.movieSpace.querySelector(".earning");

    const ratingElemnt1 = movieSearch1.movieSpace.querySelector(".rating");
    const ratingElemnt2 = movieSearch2.movieSpace.querySelector(".rating");

    let [color1, color2] = getComparisonStatus(movieSearch1.boxOfficeValue, movieSearch2.boxOfficeValue);
    boxOfficeElemnt1.style.backgroundColor = color1;
    boxOfficeElemnt2.style.backgroundColor = color2;

    [color1, color2] = getComparisonStatus(movieSearch1.rating, movieSearch2.rating);
    ratingElemnt1.style.backgroundColor = color1;
    ratingElemnt2.style.backgroundColor = color2;
}, 500);
