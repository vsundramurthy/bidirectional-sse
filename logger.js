var winston = require('winston')
  , MongoDB = require('winston-mongodb').MongoDB;

var transports = {
  transports: [ new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: 'SPOF-APP.log' }),
                new (winston.transports.MongoDB)({ host: 'localhost', db: 'spof', collection: 'app-log' })] 
};

var logger = new (winston.Logger)(transports);

module.exports = logger;
