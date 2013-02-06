var async = require('async')
  , compressor = require('node-minify');


module.exports = Bootstrap = function(gConfig, logger, next) {

  /* If deployed in production never run resource compression routine.
     also CWD to the service installation directory on windows only */
  if (process.argv.length > 2) {
    logger.info("PROD mode detected, skipping css/js compression bootstaps module..")
    logger.info('CWD before: ' + process.cwd());
    process.chdir('C:\node-app\spof\app');
    logger.info('CWD after: ' + process.cwd());
    next(null);
  } else {
    logger.info("DEV mode detected..")
    async.parallel({
      one: function(callback) {
        new compressor.minify({
          type: 'yui-js',
          fileIn: ['./public/assets/js/jquery/jquery-1.8-min.js',
                   './public/assets/js/underscore/underscore-min.js',
                   './public/assets/js/bootstrap/bootstrap-dropdown.js',
                   './public/assets/js/bootstrap/bootstrap-button.js',
                   './public/assets/js/bootstrap/bootstrap-collapse.js',
                   './public/assets/js/bootstrap/bootstrap-tooltip.js',
                   './public/assets/js/bootstrap/bootstrap-popover.js',
                   './public/assets/js/google-code-prettify/prettify.js',
                   './public/assets/js/application.js'],

          fileOut: './public/assets/js/one-js.js',
          callback: function(err) {
            logger.info("YUI Compressing JS files.."); 
            if (err) { console.log("Error compressing JS files: " + err);}
            callback(null);
          }
        });
      },
      two: function(callback) {
        new compressor.minify({
          type: 'yui',
          fileIn: ['./public/assets/css/bootstrap/bootstrap.css',
                   './public/assets/css/bootstrap/bootstrap-responsive.css',
                   './public/assets/css/docs.css',
                   './public/assets/css/google-code-prettify/prettify.css'],

          fileOut: './public/assets/css/one-css.css',
          callback: function(err) {
            logger.info("YUI Compressing CSS files..");
            if (err) { console.log("Error compressing CSS files: " + err);}
            callback(null);
          }
        });
      }
    },
    function(err, results) {
      next(null);
    });
  }
};
