// Import environmental variables from our variables.env file
require('dotenv').config({ path: '.env' });

// Require our Express app
const app = require('./app');
app.set('port', process.env.PORT || 5000);

// Start the app
const server = app.listen(app.get('port'), () => {
  console.log(`App running on port ${server.address().port}`);
});
