var cluster = require('cluster')
  , logger = require('./logger')
  , Bootstrap = require('./bootstrap')
  , gConfig = require('./config/global-config');


if (cluster.isMaster) {

  logger.info('On cluster mode..');
  logger.info('Start bootstrap..');
  Bootstrap(gConfig, logger, function() {
    logger.info('End bootstrap..');
    //require('os').cpus().forEach(function() {
      cluster.fork();
    //});

    cluster.on('exit', function(worker) {
      logger.info('SPOF App worker pid ' + worker.process.pid + ' died unexpectedly. Starting a new worker..');
      cluster.fork();
    });
  });
} else {
  var app = require('./app')(gConfig, logger);
}
