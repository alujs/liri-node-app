// Reads and sets any environmental variables with the dotenv package
require('dotenv').config();

// 
var keys = require('./keys.js');
var spotifyAPI = require('node-spotify-api');
var axios = require('axios');

var spotify = new spotifyAPI(keys.spotify);

var command = process.argv[2];
var search = process.argv.slice(3).join(" ");

console.log("\nSearch results:\n");

if (command === "concert-this") {

} else if (command === "spotify-this-song") {
    spotify
        .search({ type: 'track', query: search, limit: 1 })
        .then((response) => {
            response.tracks.items.forEach(element => {
                // Artist name
                let artist = element.album.artists[0].name;
                console.log(`Artist: ${artist}`);

                // Song name
                let song = element.name;
                console.log(`Song: ${song}`);

                // Spotify link
                let url = element.external_urls.spotify;
                console.log(`Spotify URL: ${url}`);

                // Album name
                let album = element.album.name;
                console.log(`Album: ${album}\n`);
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        });

} else if (command === "movie-this") {
    let queryUrl;

    if (search) {
        queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
    } else {
        queryUrl = "http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy";
    }

    axios
        .get(queryUrl)
        .then((response) => {
            console.log(`Title: ${response.data.Title}`);
            console.log(`Year: ${response.data.Year}`);
            console.log(`IMDB Rating: ${response.data.imdbRating}`);
            console.log(`Rotten Tomatoes: ${response.data.Ratings[1].Value}`);
            console.log(`Country: ${response.data.Country}`);
            console.log(`Language: ${response.data.Language}`);
            console.log(`Plot: ${response.data.Plot}\n`);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })

} else if (command === "do-what-it-says") {

} else {
    console.log("I'm sorry, I don't recognize that command.");
}