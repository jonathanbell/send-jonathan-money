// CHANGE IN PRODUCTION!!!!!!!!
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const validator = require('validator');

exports.paymentForm = async (req, res) => {
  // Validate token
  if (validator.isEmpty(req.body.stripeToken)) {
    return req.flash(
      'error',
      'Problem with the Stripe API or no Stripe token sent.'
    );
  }

  // Validate email
  if (!validator.isEmpty(req.body.userEmail)) {
    if (!validator.isEmail(req.body.userEmail)) {
      return req.flash(
        'error',
        `You know, that email just doesn't seem right. Please try again.`
      );
    }
  }

  // Validate amount
  if (
    !validator.isNumeric(req.body.amount) ||
    validator.isEmpty(req.body.amount)
  ) {
    return req.flash(
      'error',
      'Please enter a valid ammount (numbers only please).'
    );
  }
  if (parseInt(req.body.amount) < 1) {
    return req.flash('error', 'Please send me more than 1 dollar.');
  }
  req.body.amount = parseInt(req.body.amount);

  const chargeOptions = {
    amount: req.body.amount * 100, // Stripe charges in cents, not dollars.
    currency: 'cad',
    source: req.body.stripeToken,
    description: `${req.body.amount} Canadian dollars sent to Jonathan Bell`,
    statement_descriptor: 'Jonathan Bell - Thnx!'
  };

  if (!validator.isEmpty(req.body.userEmail)) {
    chargeOptions.receipt_email = req.body.userEmail;
  }

  // We passed all form validations, so create a Stripe charge.
  const charge = await stripe.charges.create(chargeOptions);

  // https://stripe.com/docs/api/charges/object#charge_object-outcome
  // https://stripe.com/docs/declines/codes
  if (charge.status === 'succeeded') {
    // No need to handle a redirect here. This package automatically redirects
    // back to the to the first page with the `flash` value(s) stored in session.
    req.flash('success', 'Thanks! Your cash has been received (by me)!');
  } else {
    console.error('Error while creating Stripe charge:', charge.outcome);
    req.flash(
      'error',
      `There was a problem while applying the charge to your card (${
        charge.outcome.seller_message
          ? charge.outcome.seller_message
          : 'reason unknown'
      }). You can try again or contact jonathanbell.ca@gmail.com for more information. Your card has not been charged.`
    );
  }
};

// Handles the "Pay now" button, which sends a fixed amount of $20.
exports.paymentRequest = async (req, res) => {
  // Validate token
  if (validator.isEmpty(req.body.token)) {
    console.error(
      'Request to charge Payment Request API sent without a token!'
    );
    return res.status(401).send();
  }

  const chargeOptions = {
    amount: 20 * 100, // Stripe charges in cents, not dollars.
    currency: 'cad',
    source: req.body.token,
    description: 'That 20 bucks you sent to Jonathan Bell.',
    statement_descriptor: 'Jonathan Bell - Thnx!'
  };

  // Stripe charge.
  const charge = await stripe.charges.create(chargeOptions);

  // https://stripe.com/docs/api/charges/object#charge_object-outcome
  // https://stripe.com/docs/declines/codes
  if (charge.status !== 'succeeded') {
    console.error(
      'Error while creating Stripe charge:',
      charge.outcome.seller_message
    );
    return res.status(500).send();
  }

  res.status(200).send();
};
