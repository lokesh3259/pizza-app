import Product from "../models/product.js";
import donetworkcall from "./api-client.js";

const productOperation = {
  products: [],
  cart: [],

  async loadproduct() {
    const pizzas = await donetworkcall();
    const pizzaarray = pizzas["vegetarian"] || pizzas["Vegetarian"] || [];

    const productarray = pizzaarray.map((pizza) => {
      let imageUrl =
        pizza.assets?.product_details_page?.[0]?.url ||
        "https://via.placeholder.com/150?text=Momo+Mia";
      return new Product(
        pizza.id,
        pizza.name,
        pizza.menu_description,
        Number(pizza.price),
        imageUrl
      );
    });

    this.products = productarray;
    return productarray;
  },

  search(pizzaid) {
    return this.products.find((p) => p.id == pizzaid);
  },

  addToCart(product) {
    this.cart.push(product);
  },

  removeFromCart(pizzaid) {
    this.cart = this.cart.filter((p) => p.id != pizzaid);
  },

  getCart() {
    return this.cart;
  },

  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price, 0);
  },
};

export default productOperation;
