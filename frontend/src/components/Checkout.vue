<template>
  <div class="checkout-container">
    <h2>Checkout</h2>
    <form @submit.prevent="submitOrder" class="checkout-form">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" v-model="order.name" required pattern="[A-Za-z\s]+" placeholder="John Doe">
      </div>
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" v-model="order.phone" required pattern="[0-9]+" placeholder="123-456-7890">
      </div>
      <button type="submit" :disabled="!isFormValid" class="submit-btn">Place Order</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Checkout',
  data() {
    return {
      order: {
        name: '',
        phone: ''
      }
    }
  },
  computed: {
    isNameValid() {
      return /^[A-Za-z\s]+$/.test(this.order.name);
    },
    isPhoneValid() {
      return /^[0-9]+$/.test(this.order.phone);
    },
    isFormValid() {
      return this.isNameValid && this.isPhoneValid;
    }
  },
  methods: {
    submitOrder() {
      this.$emit('submit-order', this.order)
    }
  }
}
</script>

<style scoped>
.checkout-container {
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 2rem;
  background-color: #f9f9f9;
  margin-top: 2rem;
}

h2 {
  margin-top: 0;
  font-size: 1.75rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

input {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.submit-btn {
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>
