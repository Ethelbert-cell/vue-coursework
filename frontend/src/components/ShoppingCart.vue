<template>
  <div class="cart-container">
    <h2>Shopping Cart</h2>
    <div v-if="cart.length === 0" class="empty-cart">
      <p>Your cart is currently empty.</p>
    </div>
    <div v-else>
      <div class="cart-items">
        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <div class="item-details">
            <h4>{{ item.subject }}</h4>
            <p>£{{ item.price }}</p>
          </div>
          <button @click="removeFromCart(index)" class="remove-btn">Remove</button>
        </div>
      </div>
      <div class="cart-summary">
        <div class="total">
          <span>Total:</span>
          <span>£{{ totalPrice }}</span>
        </div>
        <button class="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShoppingCart',
  props: {
    cart: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price, 0);
    }
  },
  methods: {
    removeFromCart(index) {
      this.$emit('remove-from-cart', index)
    }
  }
}
</script>

<style scoped>
.cart-container {
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 2rem;
  background-color: #f9f9f9;
}

h2 {
  margin-top: 0;
  font-size: 1.75rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  color: #777;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eaeaea;
}

.item-details h4 {
  margin: 0;
  font-size: 1.1rem;
}

.item-details p {
  margin: 0;
  color: #555;
}

.remove-btn {
  background: none;
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.remove-btn:hover {
  background-color: #ff4d4d;
  color: #fff;
}

.cart-summary {
  margin-top: 2rem;
}

.total {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.checkout-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #218838;
}
</style>
