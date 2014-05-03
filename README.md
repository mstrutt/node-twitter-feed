Node Twitter Feed
-----------------

Simple json response of a twitter timeline, caching the result for improved performance

##Setup

This requires node to run, to setup run `npm install` from this directory. Then create a `config.json` file with you API keys and details.

For continued usages I would recommend running as a service with something like upstart.

##Config.json file

```
{
	"twitter": {
		"handle": "mstrutt_co_uk",
		"key": "<your twitter API key>",
		"secret": "<your twitter API secret key>",
		"ip": "0.0.0.0",
		"port": "8080",
		"filename": "tweets.json",
		"count": 5,
		"origin": [
			"http://mstrutt.co.uk",
			"http://mstrutt.dev"
		]
	}
}
```