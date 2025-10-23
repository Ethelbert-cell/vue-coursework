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
      cart: [],
      showCart: false,
    }
  },
  mounted() {
    console.log('App component mounted');
  },
  methods: {
    toggleCart() {
      this.showCart = !this.showCart;
    },
    proceedToCheckout() {
      this.$refs.checkout.$el.scrollIntoView({ behavior: 'smooth' });
    },
    handleSearch(query) {
      this.$refs.lessons.searchLessons(query);
    },
    addToCart(lesson) {
      this.cart.push(lesson);
      lesson.spaces--;
    },
    removeFromCart(index) {
      const removedItem = this.cart.splice(index, 1)[0];
      const lesson = this.$refs.lessons.lessons.find(l => l._id === removedItem._id);
      if (lesson) {
        lesson.spaces++;
      }
    },
    submitOrder(order) {
      fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...order, cart: this.cart }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Order submission failed');
        }
        return response.json();
      })
      .then(data => {
        console.log('Order submitted:', data);
        this.cart = [];
        this.$refs.lessons.fetchLessons();
        alert('Order submitted successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('There was a problem submitting your order.');
      });
    }
  }
}
</script>

<template>
  <div id="app">
    <Header @search="handleSearch" @toggle-cart="toggleCart" :cart="cart" />
    <main>
      <Lessons v-if="!showCart" ref="lessons" @add-to-cart="addToCart" />
      <div v-else>
        <ShoppingCart :cart="cart" @remove-from-cart="removeFromCart" @proceed-to-checkout="proceedToCheckout" />
        <Checkout ref="checkout" @submit-order="submitOrder" />
      </div>
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
