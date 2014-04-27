var config = require('./config.json').twitter,
	Twitter = require('mtwitter'),
	http = require('http'),
	fs = require('fs'),

	twitter = new Twitter({
		consumer_key: config.key,
		consumer_secret: config.secret,
		application_only: true
	});

function tweetText (tweet) {
	return tweet.text;
}

function fourOhFour (request, response) {
	response.statusCode = 404;
	response.end('404');
	console.log(request.url+' went 404 :(');
}

function sendCachedTweets (request, response) {
	console.log('Serving tweets from cache');
	fs.readFile(config.filename, function(err, tweets){
		if (err) {
			console.log(err);
			response.statusCode = 500;
			response.end('Error');
		} else {
			response.end(tweets);
		}
	});	
}

function getNewTweets (request, response) {
	twitter.get('statuses/user_timeline', {
		screen_name: config.handle,
		trim_user: true,
		exclude_replies: true
	}, function(err, tweets) {
		if (err) {
			console.log(err);
			sendCachedTweets(request, response);
		} else {
			tweets = JSON.stringify(tweets.slice(0, config.count).map(tweetText));
			response.end(tweets);
			console.log('Serving up-to-date tweets');
			fs.writeFile(config.filename, tweets, function(err) {
				if (!err) console.log('Tweets saved to cache');
			});
		}
	});
}

function respondWithTweets (request, response) {
	fs.stat(config.filename, function(err, stat) {
		if (err) console.log(err);
		
		var	now = new Date().getTime(),
			lastMod = stat ? new Date(stat.mtime).getTime() : 0,
			age = Math.round((now - lastMod) / 1000);
		
		console.log(age + 's since last update');
	
		if (age > 300) {
			getNewTweets(request, response);
		} else {
			sendCachedTweets(request, response)
		}
	});
}

http.createServer(function (request, response) {
	console.log(request.url);
	if (request.url.indexOf(config.filename) === -1) {
		fourOhFour(request, response);
	} else {
		respondWithTweets(request, response);
	}
}).listen(config.port, config.ip);

console.log('Twitter server started at http://'+config.ip+':'+config.port);