// Reads and sets any environmental variables with the dotenv package
require('dotenv').config();

// 
var keys = require('./keys.js');
var spotifyAPI = require('node-spotify-api');

var spotify = new spotifyAPI(keys.spotify);

var command = process.argv[2];
var search = process.argv.slice(3).join(" ");

console.log("\nSearch results:\n");

if (command === "concert-this") {

} else if (command === "spotify-this-song") {
    spotify
        .search({ type: 'track', query: search, limit: 1 })
        .then(function (response) {
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
        .catch(function (err) {
            console.log(`Error: ${err}`);
        });

} else if (command === "movie-this") {

} else if (command === "do-what-it-says") {

} else {
    console.log("I'm sorry, I don't recognize that command.");
}