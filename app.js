const path = require('path');
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const httpStatus = require('http-status');
const dotenv = require('dotenv');
const passport = require('passport');

const app = express();

app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(logger('dev'));
app.use(helmet());
app.use(xss());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'developsecret',
  name: 'startercookie', // change the cookie name for additional security in production
  cookie: {
    maxAge: 1209600000, // Two weeks in milliseconds
  }
}));

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    res.status(404).send('Page Not Found');
  });
  
  if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
  } else {
    app.use((err, req, res) => {
      console.error(err);
      res.status(500).send('Server Error');
    });
  }
  
  /**
   * Start Express server.
   */
  app.listen(app.get('port'), () => {
  
    console.log(`App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode.`);
    console.log('Press CTRL-C to stop.');
  });
  
  module.exports = app;