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

function getAge (file) {
	var stat = fs.statSync(config.filename),
		now = new Date().getTime(),
		lastMod = new Date(stat.mtime).getTime();
		age = Math.round((now - lastMod) / 1000);
	console.log(age + 's since last update');
	return age;
}

function fourOhFour (request, response) {
	response.statusCode = 404;
	response.end('404');
	console.log(request.url+' went 404 :(');
}

http.createServer(function (request, response) {
	console.log(request.url);
	if (request.url.indexOf(config.filename) === -1) {
		fourOhFour(request, response);
	} else {
		if (getAge(config.filename) > 300) {
			twitter.get('statuses/user_timeline', {
				screen_name: config.handle,
				trim_user: true,
				exclude_replies: true
			}, function(err, tweets) {
				if (err)
					console.log(err);
				else {
					tweets = JSON.stringify(tweets.slice(0, config.count).map(tweetText));
					fs.writeFile(config.filename, tweets);
					console.log('Tweets saved to cache');
					response.end(tweets);
					console.log('Serving up-to-date tweets');
				}
			});
		} else {
			console.log('Serving tweets from cache');
			fs.readFile(config.filename, function(err, tweets){
				if (err)
					console.log(err);
				else
					response.end(tweets);
			});		
		}
	}
}).listen(config.port, config.ip);

console.log('Twitter server started at http://'+config.ip+':'+config.port);