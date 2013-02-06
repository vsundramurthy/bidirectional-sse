var express = require('express')
  , cons = require('consolidate')
  , SSE = require('sse');


module.exports = function(gConfig, logger) {
  app = express();
  app.mongoose = require('mongoose');

  /* Set Logger */
  app.logger = logger;

  /* Set Global Config */
  app.gConfig = gConfig;

  /* Set App Config */
  app.config = require('./config/app-config.js')(app, express);

  /* Set View Config */
  app.engine('dust', cons.dust);

  /* Add Models */
  var models = {};

  /* Init Routes */
  require('./routes/routes')(app, models);

  /* Start Server */
  app.listen(app.config.serverPort, function() {
    logger.info("An app instance running on port " + app.gConfig.server.port + "..");
  });
}
