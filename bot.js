var Twit   = require('twit'),
    Config = require('./config.js');

if (Config.debug) console.log("In debug mode.");

let T = new Twit({
    consumer_key: Config.consumer_key,
    consumer_secret: Config.consumer_secret,
    access_token: Config.access_token,
    access_token_secret: Config.access_token_secret
});

let stream = T.stream('user', { with: 'followings' } );

stream.on('tweet', function (tweet) {
    if (Config.valid(tweet)) {
        if (!Config.debug) {
            T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
                if (err) console.error(`[${err.statusCode}] ERROR ${err.code}: ${err.message}`);
                else console.log(`[${(new Date()).toJSON()}] SENT - ${data.id}`);
            });
        } else console.log(`[${(new Date()).toJSON()}] @${tweet.user.screen_name}: ${tweet.text}`);
    } else console.log(`[${(new Date()).toJSON()}] INVALID - @${tweet.user.screen_name}: ${tweet.text}`);
});

stream.on('warning', function (item) { console.log('WARNING: ' + item); });
stream.on('disconnect', function () { console.log('Stream disconnected.'); });
stream.on('connect', function () { console.log('Stream connected.'); });
stream.on('reconnect', function () { console.log('Stream reconnected.'); });