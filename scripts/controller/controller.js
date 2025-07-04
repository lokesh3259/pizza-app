import productOperation from "../services/product-operation.js";

let allPizzas = [];

async function loadpizza() {
  allPizzas = await productOperation.loadproduct();
  renderPizzaCards(allPizzas);
  renderCart();
}

function renderPizzaCards(pizzas) {
  const outdiv = document.querySelector("#output");
  outdiv.innerHTML = "";
  for (let pizza of pizzas) {
    preparePizzaCard(pizza);
  }
}

loadpizza();

function addTocart() {
  const pizzaid = this.getAttribute("product-id");
  const product = productOperation.search(pizzaid);
  if (product) {
    productOperation.addToCart(product);
    renderCart();
  }
}

function removeFromCart() {
  const pizzaid = this.getAttribute("product-id");
  productOperation.removeFromCart(pizzaid);
  renderCart();
}

function clearCart() {
  productOperation.cart = [];
  renderCart();
}

function preparePizzaCard(pizza) {
  const outdiv = document.querySelector("#output");

  const coldiv = document.createElement("div");
  coldiv.className = "col-md-4 mb-3";

  const carddiv = document.createElement("div");
  carddiv.className = "card h-100 shadow";
  carddiv.style.width = "18rem";

  const img = document.createElement("img");
  img.src = pizza.url;
  img.className = "card-img-top";
  img.alt = pizza.name;
  carddiv.appendChild(img);

  const cardbody = document.createElement("div");
  cardbody.className = "card-body";

  const h5 = document.createElement("h5");
  h5.className = "card-title";
  h5.innerText = pizza.name;

  const priceTag = document.createElement("h6");
  priceTag.className = "text-success";
  priceTag.innerText = `₹${pizza.price}`;

  const pTag = document.createElement("p");
  pTag.className = "card-text";
  pTag.innerText = pizza.desc;

  const button = document.createElement("button");
  button.setAttribute("product-id", pizza.id);
  button.className = "btn btn-primary mt-2";
  button.innerText = "Add To Cart";
  button.addEventListener("click", addTocart);

  cardbody.appendChild(h5);
  cardbody.appendChild(priceTag);
  cardbody.appendChild(pTag);
  cardbody.appendChild(button);

  carddiv.appendChild(cardbody);
  coldiv.appendChild(carddiv);
  outdiv.appendChild(coldiv);
}

function renderCart() {
  const cartDiv = document.querySelector("#cart");
  cartDiv.innerHTML = `
    <h3 class="text-success d-flex justify-content-between">
      🛒 Basket <span class="badge bg-primary">${
        productOperation.getCart().length
      }</span>
    </h3>
  `;

  const cartItems = productOperation.getCart();
  const ul = document.createElement("ul");
  ul.className = "list-group mb-3";

  if (cartItems.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "text-muted text-center mt-3";
    emptyMsg.innerText = "🧁 Your basket is empty. Add some delicious pizzas!";
    cartDiv.appendChild(emptyMsg);
    return;
  }

  for (let item of cartItems) {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${item.name} - ₹${item.price}</span>
      <button class="btn btn-sm btn-danger" product-id="${item.id}">❌</button>
    `;
    ul.appendChild(li);
  }

  ul.querySelectorAll(".btn-danger").forEach((btn) => {
    btn.addEventListener("click", removeFromCart);
  });

  const totalLi = document.createElement("li");
  totalLi.className =
    "list-group-item list-group-item-info d-flex justify-content-between";
  totalLi.innerHTML = `<strong>Total</strong><strong>₹${productOperation.getTotal()}</strong>`;
  ul.appendChild(totalLi);

  cartDiv.appendChild(ul);

  const checkoutBtn = document.createElement("a");
  checkoutBtn.href = "checkout.html";
  checkoutBtn.className = "btn btn-warning w-100 mb-2";
  checkoutBtn.innerText = "Proceed to Checkout";
  cartDiv.appendChild(checkoutBtn);

  const clearBtn = document.createElement("button");
  clearBtn.className = "btn btn-danger w-100";
  clearBtn.innerText = "Clear Cart";
  clearBtn.addEventListener("click", clearCart);
  cartDiv.appendChild(clearBtn);
}

document.querySelector("#searchBox")?.addEventListener("input", function () {
  const keyword = this.value.trim().toLowerCase();
  const filtered = allPizzas.filter(
    (pizza) =>
      pizza.name.toLowerCase().includes(keyword) ||
      pizza.desc.toLowerCase().includes(keyword)
  );
  renderPizzaCards(filtered);
});
