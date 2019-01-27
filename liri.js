// Reads and sets any environmental variables with the dotenv package
require('dotenv').config();

var keys = require('./keys.js');
var spotifyAPI = require('node-spotify-api');

var spotify = new spotifyAPI(keys.spotify);

console.log(spotify);
