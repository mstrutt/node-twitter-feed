var config = require('./config.json').twitter,
	Twitter = require('mtwitter'),
	fs = require('fs');

var twitter = new Twitter({
	consumer_key: config.key,
	consumer_secret: config.secret,
	application_only: true
});

twitter.get('statuses/user_timeline', {
	screen_name: config.handle,
	trim_user: true,
	exclude_replies: true
}, function(err, item) {
	if (err)
		console.log(err);
	else {
		var tweets = [];
		item.forEach(function(tweet){
			tweets.push(tweet.text);
		});
		fs.writeFileSync('tweets.json', JSON.stringify(tweets));
	}
	process.exit();
});