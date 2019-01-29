// Reads and sets any environmental variables with the dotenv package
require('dotenv').config();

// Require necessary Node packages
var keys = require('./keys.js');
var spotifyAPI = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');

var spotify = new spotifyAPI(keys.spotify);

var command = process.argv[2];
var search = process.argv.slice(3).join(" ");
var queryUrl;

console.log("\nSearch results:\n");

if (command === "concert-this") {

    // Calls concert search function
    concertSearch(command, search);

} else if (command === "spotify-this-song") {

    // Calls spotify search function
    spotifySearch(command, search);

} else if (command === "movie-this") {

    // Calls movie search function
    movieSearch(command, search);

} else if (command === "do-what-it-says") {

    // Reads random.txt file 
    fs.readFile("random.txt", "utf8", (error, data) => {
        if (error) {
            console.log(`Error: ${error}`);
        }

        // Splits response at the comma
        let docTxt = data.split(",");

        command = docTxt[0];
        search = docTxt[1];

        switch (command.includes("")) {

            case command.includes("concert"):
                concertSearch(command, search);
                break;
            case command.includes("spotify"):
                spotifySearch(command, search);
                break;
            case command.includes("movie"):
                movieSearch(command, search);
                break;
            default:
                console.log("LIRI cannot perform the command.")
        }
    });

} else {
    console.log("I'm sorry, I don't recognize that command.");
}

function concertSearch(command, search) {
    queryUrl = `https://rest.bandsintown.com/artists/${search}/events?app_id=codingbootcamp`;

    axios
        .get(queryUrl)
        .then((response) => {
            let element = response.data[0];

            // Name of the venue
            let venueName = element.venue.name;
            console.log(`Venue: ${venueName}`);

            // Venue location
            let venueCity = element.venue.city;
            let venueRegion = element.venue.region;
            let venueCountry = element.venue.country;
            console.log(`Location: ${venueCity}, ${venueRegion} ${venueCountry}`);

            // Date of the event
            let venueDate = moment(element.datetime).format("MM/DD/YYYY");

            console.log(`Date: ${venueDate}\n`);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
};

function spotifySearch(command, search) {
    if (search == "") {
        search = "The Sign Ace of Base";
    }
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
};

function movieSearch(command, search) {
    if (search) {
        queryUrl = `http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=trilogy`;
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
};