const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const flash = require('express-flash-notification');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();

// Don't minify html.
app.locals.pretty = true;

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Views
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

// Adds request properties available on `req.body`
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sessions: allows us to send flash messages on a single request.
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
  })
);

// Use session flashes.
app.use(flash(app));

// Handle all of our own routes.
app.use('/', routes);

// Routes above^^^ didn't work. Probably a 404. Call `errorHandlers.notFound`
app.use(errorHandlers.notFound);

// Really bad error... : |
if (app.get('env') === 'development') {
  // Development error handler
  app.use(errorHandlers.developmentErrors);
}

// Production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
