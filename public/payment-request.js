const configOptions = {
  country: 'CA',
  currency: 'cad',
  total: {
    label: 'Total',
    amount: 2000 // (cents)
  },
  requestPayerName: false,
  requestPayerEmail: false
};

const paymentRequest = stripe.paymentRequest(configOptions);

const prButton = elements.create('paymentRequestButton', {
  paymentRequest,
  style: {
    paymentRequestButton: {
      type: 'default',
      theme: 'light',
      height: '35px'
    }
  }
});

// Check the availability of the Payment Request API first.
(async () => {
  const result = await paymentRequest.canMakePayment();
  if (result) {
    // We have access to the Payment Request API.
    // Mount the payment request button.
    prButton.mount('#payment-request-button');
  } else {
    // We do not have access to the Payment Request API.
    // So, hide the payment request element(s).
    document.getElementById('payment-request-button-wrapper').style.display =
      'none';
  }
})();

paymentRequest.on('token', async ev => {
  // Send the token to your server to charge it!
  const response = await fetch('/payment-request', {
    method: 'POST',
    body: JSON.stringify({ token: ev.token.id }),
    headers: { 'content-type': 'application/json' }
  });

  // console.log('ev', ev);
  // console.log('response', response);

  if (response.ok) {
    // Report to the browser that the payment was successful, prompting
    // it to close the browser payment interface.
    ev.complete('success');
    displaySuccessfulAttempt();
  } else {
    // Report to the browser that the payment failed, prompting it to
    // re-show the payment interface, or show an error message and close
    // the payment interface.
    ev.complete('fail');
    displayFailedAttempt();
  }
});

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function displayFailedAttempt() {
  const flash = document.createElement('p');
  flash.classList.add('flash', 'error');
  flash.innerHTML = `<strong>error:</strong> <span>The attempt to charge you did not work out. More information may be available in the JavaScript console. You have not been charged.</span>`;

  console.error(
    'The server did not reply with a 200 status code. Check server error logs for issues with the Stripe API.'
  );

  insertAfter(flash, mainHeading);
}

function displaySuccessfulAttempt() {
  const flash = document.createElement('p');
  flash.classList.add('flash', 'success');
  flash.innerHTML = `<strong>yay!</strong> <span>Hey thanks! That twenty bucks will feel good in my tummy.</span>`;

  insertAfter(flash, mainHeading);
}
