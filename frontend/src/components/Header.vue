<template>
  <header>
    <div class="logo">
      <h1>m.</h1>
    </div>
    <nav>
      <ul>
        <li><a href="#" class="active">Home</a></li>
        <li><a href="#">Lessons</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
    <div class="actions">
      <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Search..." class="search-bar">
      <button class="cart-btn">🛒</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchQuery);
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
}

.logo h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s;
}

nav a:hover, nav a.active {
  color: #007bff;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar {
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.cart-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
