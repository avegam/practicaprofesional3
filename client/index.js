// MP
const mercadopago = new MercadoPago("TEST-002e7355-b26c-43b4-880d-29ff8adaa5e9", {
  locale: "es-AR", // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

document.getElementById("checkout-btn").addEventListener("click", function () {
  const orderData = {
    quantity: document.getElementById("quantity").innerHTML,
    description: document.getElementById("product-description").innerHTML,
    price: document.getElementById("unit-price").innerHTML,
  };

  fetch("/create_preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (preference) {
      createCheckoutButton(preference.id);
    })
    .catch(function () {
      alert("Unexpected error");
    });
});

function createCheckoutButton(preferenceId) {
  // Initialize the checkout
  const bricksBuilder = mercadopago.bricks();

  const renderComponent = async (bricksBuilder) => {
    if (window.checkoutButton) window.checkoutButton.unmount();
    await bricksBuilder.create(
      "wallet",
      "button-checkout", // class/id where the payment button will be displayed
      {
        initialization: {
          preferenceId: preferenceId,
        },
        callbacks: {
          onError: (error) => console.error(error),
          onReady: () => {},
        },
      }
    );
  };
  window.checkoutButton = renderComponent(bricksBuilder);
}

