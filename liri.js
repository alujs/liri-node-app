// Reads and sets any environmental variables with the dotenv package
require('dotenv').config();

// Require necessary Node packages
const keys = require('./keys.js');
const spotifyAPI = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

const spotify = new spotifyAPI(keys.spotify);

let command = process.argv[2];
let search = process.argv.slice(3).join(" ");
let queryUrl;
let object = {};

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

            object.Command = command;
            object.Search = search;
            object.Venue = venueName;
            object.Location = `${venueCity}, ${venueRegion} ${venueCountry}`;
            object.Date = venueDate;

            outputText(object);
            
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

                // Log Text
                object.Command = command;
                object.Search = search;
                object.Artist = artist;
                object.Song = song;
                object.SpotifyURL = url;
                object.Album = album;

                outputText(object);
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

            // Movie title
            let title = response.data.Title;
            console.log(`Title: ${title}`);

            // Movie year
            let year = response.data.Year;
            console.log(`Year: ${year}`);

            // IMDB rating
            let imdbRating = response.data.imdbRating;
            console.log(`IMDB Rating: ${imdbRating}`);

            // Rotten Tomatoes rating
            let rtRating = response.data.Ratings[1].Value;
            console.log(`Rotten Tomatoes: ${rtRating}`);

            // Country movie was made
            let country = response.data.Country;
            console.log(`Country: ${country}`);

            // Movie language
            let language = response.data.Language;
            console.log(`Language: ${language}`);

            // Moive plot
            let plot = response.data.Plot;
            console.log(`Plot: ${plot}\n`);

            // Log Text
            object.Command = command;
            object.Search = search;
            object.Title = title;
            object.Year = year;
            object.imdbRating = imdbRating;
            object.rtRating = rtRating;
            object.Country = country;
            object.Language = language;
            object.Plot = plot;

            outputText(object);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
};

function outputText (object) {
    fs.appendFile('log.txt', `${JSON.stringify(object)}\n`, (err) => {
        if (err) {
            console.log(`Error: ${err}`);
        }
        console.log("Data was appended to the file")
    })
}