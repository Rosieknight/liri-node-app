//Variables to read and store information from keys.js
var twitter = require("twitter");
var keyring = require("./keys.js");
var rightKeys = twitter(keyring.twitterKeys);

//Variable to read and write different text files
var fs = require("fs");

//Variable to use the spotify module
var spotify = require("spotify");

//Variable for to use the request module
var request = require("request");

//Variable for all possible commands for liri
var action = process.argv[2];

//Variables in case song or movie is longer than one word and not in quotes
var wide = process.argv;
var term = "";

//Loops through all the of the possible words in the song or moive title, then adds 
//to the variable term (for search term).
for (var i = 3; i < wide.length; i++) {
	if (i > 2 && i < wide.length) {

    term = term + " + " + wide[i];

  } else {

    term += wide[i];

  }
}

//Variable for the Omdb's api.
//var moiveQuery = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&r=json";

//Commands for liri
switch(action){

	//Calls function myTweets. 
	case "my-tweets":
	myTweets();
	break;

	//Calls the metnod spotifySong. Adds a search term if none is provided.
	case "spotify-this-song":
	if(term ===""){
		term = "The Sign " + "Ace of Base";
		spotifySong();
	}else{
		spotifySong();
	}
	break;

	//Calls funtion movieStuff. Adds in the search term if the varible is empty.
	case "movie-this":
	//Variable for the Omdb's api.
	var moiveQuery = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&r=json";
	if(term ===""){
		term = "Mr." + "+" + "Nobody";
		moiveQuery = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&r=json";
		movieStuff();
	} else{
		movieStuff();
	}
	break;

	//Calls the method beRandom.
	case "do-what-it-says":
	beRandom();
	break;

	//This command exists because I keep forgetting Liri's commands after I've
	//finished coding one.
	case "help":
	liriHelps();
	break;
}

//Function for the Twitter command
function myTweets(){
	var params = {screen_name: 'JediRose13', limit: 20};
	rightKeys.get('statuses/user_timeline', params, function(error, tweets, response) {
 		if (!error) {
 			for (var i = 0; i < 20; i++) {
 				console.log(" ");
 				console.log(tweets[i].text);
 				console.log(" ");
 				console.log("----------------------------------------------------------------------------------");
 			}
		}
	});
}

//Function for the Spotify command
function spotifySong(){
	spotify.search({type: 'track', query: term}, function(err, data) {
	    if (err) {
	        console.log('Error occurred: ' + err);
	        return;
	    } else{
	    	var results = data.tracks;
	    	for (var i = 0; i < 20; i++) {
	    		console.log(" ");
	    		console.log("Artist: " + results.items[i].artists[0].name);
	    		console.log("Song Title: " + results.items[i].name);
	    		console.log("Preview: " + results.items[i].preview_url);
	    		console.log("Album Name: " + results.items[i].album.name);
	    		console.log(" ");
	    		console.log("-------------------------------------------------------------------------------------------------------");
	    	}
	    }
	});
}

//Function for the OMDB command
function movieStuff(){
	request(moiveQuery, function(error, response, body) {
		// If the request is successful
	  	if (!error && response.statusCode === 200) {

	    	// Parse the body of the site to find wanted info.
	    	console.log("Title: " + JSON.parse(body).Title);
	    	console.log("Release Year: " + JSON.parse(body).Year);
	    	console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	    	console.log("Country: " + JSON.parse(body).Country);
	    	console.log("Language: " + JSON.parse(body).Language);
	    	console.log("Plot: " + JSON.parse(body).Plot);
	    	console.log("Actors: " + JSON.parse(body).Actors);
	    	console.log("Rotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value);
	    	//The one below is in the requirements as Rotten Tomatoes page. However, 
	    	//that information isn't provided by OMDb. I can't be certain Rotten 
	    	//Tomatoes would contact me in a timely manner AND when I'm not at work. So,
	    	//this is my work-around solution. If I were actually doing this for a job,
	    	//I would use Rotten Tomatoes' form and have the code below as my backup 
	    	//plan if they took too long to respond or denyed my request.
	    	console.log("Find it on IMDb: http://www.imdb.com/title/" + JSON.parse(body).imdbID + "/");
	  	}
	});
}

//Function for the random command
function beRandom(){
	fs.readFile("random.txt", "utf8", function(error, data) {

		//Splitting the data at commas makes it easier to read.
		var inFile = data.split(",");

		//Defining the array inFile as the action and terms for Liri.
		action = inFile[0];
		term = inFile[1];
		spotifySong();
	/*}).end(function(){
		console.log(action);
		console.log(term);*/
	});
	/*var useful =fs.readFileSync("random.txt");
	var fromFile = useful.toString().split(",");
	action = fromFile[0];
	term = fromFile[1];
	console.log(action);
	console.log(term);
	return action;
	return term;*/
}

//I keep forgeting what Liri's commands are, so I made this function to remind me.
function liriHelps(){
	console.log("Oh, did you forget what I can do?");
	console.log("my-tweets <- This shows tweets from my programmer's account.");
	console.log("spotify-this-song <- This lets me look up information on a song.");
	console.log("movie-this <- I use this to show you facts about a movie.");
	console.log("do-what-it-says <- It's a surprise! No peeking!");
	console.log("help <- Shows this list of commands. If you forget what I can do, just ask for help!");
}