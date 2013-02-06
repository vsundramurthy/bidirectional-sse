var async = require('async')
  , redis   = require('redis')
  , sse   = require('../lib/sse')
  , uuid = require('node-uuid')
  , publisher = redis.createClient(6379, 'steven-stratus-14836.stratus.dev.ebay.com');


module.exports = function(app, models) {

  app.get('/sse/:sid', function(req, res) {
    res.render('index.dust', {dbg: app.dbg});
  });

  app.get('/sse/ac/:sid/:q', function(req, res) {
    var data = {q: req.params.q};
    publisher.publish(req.params.sid, JSON.stringify(data));
    res.send(204);
  });

  app.get('/data-stream', function(req, res) {
    console.log('New SSE connection.')
    req.socket.setTimeout(Infinity);
    console.log(req.headers);

    var messageCount = 0;
    var sid = uuid.v4();
    console.log(sid);

    var subscriber = redis.createClient(6379, 'steven-stratus-14836.stratus.dev.ebay.com');

    subscriber.subscribe(sid);

    subscriber.on("error", function(err) {
      console.log("Redis Error: " + err);
    });

    subscriber.on("message", function(channel, message) {
      console.log('Subscriber alerted!')
      messageCount++; // Increment our message count
      sse.sendEvent(res, messageCount++, 'update1', new Date().getTime());
      sse.sendEvent(res, messageCount++, 'update2', new Date().getTime());
      sse.sendEvent(res, messageCount++, 'update3', new Date().getTime());
      sse.sendEvent(res, messageCount++, 'update4', new Date().getTime());
    });

    //send headers for event-stream connection
    res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
    });
    res.write('\n');

    sse.sendRetry(res, messageCount++, 10);
    sse.sendEvent(res, messageCount++, 'sid', sid);

    req.on("close", function() {
      console.log('SSE stream closed.')
      subscriber.unsubscribe();
      subscriber.quit();
      res.end();
    });

  });
};
