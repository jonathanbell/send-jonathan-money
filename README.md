# Send Jonathan Money

I wanted to get to know the Stripe API so I made this web app. You can [use it to send me money](https://send-jonathan-money.herokuapp.com/) (thanks).

## Uses:

- [NPM Stripe API wrapper](https://www.npmjs.com/package/stripe) (server side)
- [Stripe.js](https://stripe.com/docs/stripe-js/reference) (client side)
- [Payment Request API](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API)
- [Stripe Payment Request Button](https://stripe.com/docs/stripe-js/elements/payment-request-button)

## Installation

1. Clone or download this repo
1. `cd <this project>`
1. `npm install`
1. `cp .env.example .env`
1. Edit the values to be correct in `.env` (Stripe keys can be found on the [Stripe Dashboard](https://dashboard.stripe.com/account/apikeys))
1. If you're not me, change my hard-coded public Stripe key to your own (around line 61 in `views/index.mustache`)
1. `npm run dev` will watch files for changes and call `nodemon` in order to restart the app locally while you work.

TODO: Get a solid `npm run deploy` script working.

If you need HTTPS while developing with payment gateways/APIs, you can always try [Ngrok](https://ngrok.com/) like so: `ngrok http 5000`

**Oh yeah**, you'll also need to [register your domain with Apple Pay](https://stripe.com/docs/stripe-js/elements/payment-request-button#verifying-your-domain-with-apple-pay), both in development and production.
