<script>
import Header from './components/Header.vue'
import Lessons from './components/Lessons.vue'
import ShoppingCart from './components/ShoppingCart.vue'
import Checkout from './components/Checkout.vue'

export default {
  name: 'App',
  components: {
    Header,
    Lessons,
    ShoppingCart,
    Checkout
  },
  data() {
    return {
      cart: []
    }
  },
  mounted() {
    console.log('App component mounted');
  },
  methods: {
    proceedToCheckout() {
      this.$refs.checkout.$el.scrollIntoView({ behavior: 'smooth' });
    },
    handleSearch(query) {
      this.$refs.lessons.searchLessons(query);
    },
    addToCart(lesson) {
      this.cart.push(lesson)
    },
    removeFromCart(index) {
      this.cart.splice(index, 1)
    },
    submitOrder(order) {
      fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...order, cart: this.cart }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Order submitted:', data);
        this.cart = [];
        this.$refs.lessons.fetchLessons();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }
}
</script>

<template>
  <div id="app">
    <Header @search="handleSearch" />
    <main>
      <Lessons ref="lessons" @add-to-cart="addToCart" />
      <ShoppingCart :cart="cart" @remove-from-cart="removeFromCart" @proceed-to-checkout="proceedToCheckout" />
      <Checkout ref="checkout" @submit-order="submitOrder" />
    </main>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
