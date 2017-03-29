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
	    term += wide[i] + " + ";
	} else {
	    term += wide[i];
	}
}

//This makes the do-what-it-says series run correctly.
if(action==="do-what-it-says"){
	beRandom();
	liriCommands();
}else{
	liriCommands();
}

//Commands for liri
function liriCommands(){
	//Switch instead of if/else functions.
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
		if(term ===""){
			term = "Mr." + "+" + "Nobody";
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
		case "--h":
		case "-h":
		case "--help":
		case "-help":
		case "help":
		liriHelps();
		break;
	}
}

//Function for the Twitter command
function myTweets(){
	var params = {screen_name: 'JediRose13', limit: 20};
	rightKeys.get('statuses/user_timeline', params, function(error, tweets, response) {
 		if (!error) {
 			for (var i = 0; i < 20; i++) {
 				console.log(" ");
 				console.log(tweets[i].text + 
 					"\n----------------------------------------------------------------------------------");			
 			}
		}
	});
	//There's nothing special about the (%). It's just an attempt at making 
	//the text file easier to read.
	fs.appendFile("log.txt", " (%) Get Tweets");
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
	    		console.log("Song Title: " + results.items[i].name +
	    			"\nArtist: " + results.items[i].artists[0].name + "\nPreview: " + 
	    			results.items[i].preview_url + "\nAlbum Name: " 
	    			+ results.items[i].album.name + 
	    			"\n-------------------------------------------------------------------------------------------------------");
	    	}
	    }
	});
	fs.appendFile("log.txt", " (%) Find song: " + term);
}

//Function for the OMDB command
function movieStuff(){
	//Variable for the Omdb's api.
	var moiveQuery = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&r=json";
	request(moiveQuery, function(error, response, body) {
		// If the request is successful
	  	if (!error && response.statusCode === 200) {

	    	// Parse the body of the site to find wanted info.
	    	console.log("Title: " + JSON.parse(body).Title + "\nRelease Year: " + 
	    		JSON.parse(body).Year + "\nIMDB Rating: " + 
	    		JSON.parse(body).imdbRating + "\nCountry: " + 
	    		JSON.parse(body).Country + "\nLanguage: " + 
	    		JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + 
	    		"\nActors: " + JSON.parse(body).Actors + "\nRotten Tomatoes Score: " 
	    		+ JSON.parse(body).Ratings[1].Value);
	    	//The one below is in the requirements as Rotten Tomatoes page. However, 
	    	//that information isn't provided by OMDb. I can't be certain Rotten 
	    	//Tomatoes would contact me in a timely manner AND when I'm not at work. So,
	    	//this is my work-around solution. If I were actually doing this for a job,
	    	//I would use Rotten Tomatoes' form and have the code below as my backup 
	    	//plan if they took too long to respond or denyed my request.
	    	console.log("Find it on IMDb: http://www.imdb.com/title/" + JSON.parse(body).imdbID + "/");
	    }
	});
	fs.appendFile("log.txt", " (%) Find movie: " + term);
}

//Function for the random command
function beRandom(){
	fs.appendFile("log.txt", " (%) Read file named random.txt and ");
	var useful = fs.readFileSync("random.txt");
	var fromFile = useful.toString().split(",");
	action = fromFile[0];
	term = fromFile[1];
	return;
}

//I keep forgeting what Liri's commands are, so I made this function to remind me.
function liriHelps(){
	console.log("Oh, did you forget what I can do?" + 
		"\nmy-tweets <- This shows tweets from my programmer's account." + 
		"\nspotify-this-song <- This lets me look up information on a song." + 
		"\nmovie-this <- I use this to show you facts about a movie." + 
		"\ndo-what-it-says <- It's a surprise! No peeking!" + 
		"\nhelp <- Shows this list of commands. If you forget what I can do, just ask for help!");
	fs.appendFile("log.txt", " (%) Show all of Liri's commands: my-tweets, spotify-this-song, movie-this, do-what-it-says, and help.");
}