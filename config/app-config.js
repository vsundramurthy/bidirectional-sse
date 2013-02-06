var winston = require('winston')
  , cons = require('consolidate')
  , StatusCode = require('../lib/const')
  , util = require('util');


module.exports = function(app, express) {
  var config = this;

  app.dbg = true;

  config.serverPort = app.gConfig.server.port;

  var winstonStream = {
    write: function(message, encoding) {
      app.logger.info(message);
    }
  };

  /* General config */
  app.configure(function() {
    app.use(express.logger({ stream: winstonStream }));
    app.use(express.static('./public'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'keyboard cat', cookie: { maxAge: 60000000 }}));
    app.use(express.methodOverride());

    app.use(app.router);

    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.end(JSON.stringify({ error: err }));
      var msg = {code: StatusCode.SERVER_LOG,  error: err };
      app.logger.error(msg);
    });
  });

  /* DB config */
  app.configure(function() {
    app.mongoose.connect('mongodb://localhost/spof');
  });

  return config;
};