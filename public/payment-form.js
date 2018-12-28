const submitButton = document.getElementById('submitButton');
const amount = document.getElementById('amount');
amount.addEventListener('change', function() {
  mainHeading.innerHTML = `Send Me $${
    this.value
  } <span title="Send money to Jonathan Bell">💸</span>`;
  submitButton.innerText = `Send $${this.value}`;
});

// Create an instance of the card Element.
const card = elements.create('card'); // Pass a second param as an object here for config.

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  let displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
const form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      let errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      handlePaymentFormSubmit(result.token);
    }
  });
});

function handlePaymentFormSubmit(token) {
  const form = document.getElementById('payment-form');

  // Insert the token ID into the form so it gets submitted to the server.
  const hiddenTokenInput = document.createElement('input');
  hiddenTokenInput.setAttribute('type', 'hidden');
  hiddenTokenInput.setAttribute('name', 'stripeToken');
  hiddenTokenInput.setAttribute('value', token.id);
  form.appendChild(hiddenTokenInput);

  // Insert the name and ammount into the form so that they get submitted to the server.
  const hiddenNameInput = document.createElement('input');
  hiddenNameInput.setAttribute('type', 'hidden');
  hiddenNameInput.setAttribute('name', 'userEmail');
  hiddenNameInput.setAttribute(
    'value',
    document.getElementById('userEmail').value
  );
  form.appendChild(hiddenNameInput);

  const hiddenAmountInput = document.createElement('input');
  hiddenAmountInput.setAttribute('type', 'hidden');
  hiddenAmountInput.setAttribute('name', 'amount');
  hiddenAmountInput.setAttribute(
    'value',
    document.getElementById('amount').value
  );
  form.appendChild(hiddenAmountInput);

  // Now, submit the form.
  form.submit();
}
