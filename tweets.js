var config = require('./config.json').twitter,
	Twitter = require('mtwitter'),
	fs = require('fs'),

	twitter = new Twitter({
		consumer_key: config.key,
		consumer_secret: config.secret,
		application_only: true
	}),

	tweetText = function(tweet){
		return tweet.text;
	},

	stat = fs.statSync('tweets.json'),
	now = new Date().getTime(),
	lastMod = new Date(stat.ctime).getTime(),
	age = now - lastMod;

if (age >  + 300000) {
	twitter.get('statuses/user_timeline', {
		screen_name: config.handle,
		trim_user: true,
		exclude_replies: true
	}, function(err, feed) {
		if (err)
			console.log(err);
		else {
			fs.writeFileSync('tweets.json', JSON.stringify(feed.map(tweetText)));
			console.log('Tweets save to tweets.json');
		}
		process.exit();
	});
} else {
	console.log('Using cached version ('+Math.floor(age / 1000)+'s)');
	process.exit();
}