const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');
const { catchErrors } = require('../handlers/errorHandlers');

// Please stop asking me for a favicon...
router.get('/favicon.ico', function(req, res) {
  res.status(204).send();
});

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/', catchErrors(stripeController.paymentForm));
router.post('/payment-request', catchErrors(stripeController.paymentRequest));

module.exports = router;
