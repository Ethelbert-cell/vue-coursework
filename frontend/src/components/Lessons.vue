<template>
  <div class="lessons-container">
    <div class="toolbar">
      <input type="text" v-model="searchQuery" @input="searchLessons" placeholder="Search lessons..." class="search-input">
      <select v-model="selectedSubject" @change="filterLessons" class="filter-select">
        <option value="">All Subjects</option>
        <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
      </select>
    </div>
    <div class="lesson-grid">
      <div v-for="lesson in filteredLessons" :key="lesson.id" class="lesson-card">
        <img :src="lesson.image" :alt="lesson.subject" class="lesson-image">
        <div class="lesson-info">
          <h3>{{ lesson.subject }}</h3>
          <p>{{ lesson.location }}</p>
          <p class="price">£{{ lesson.price }}</p>
        </div>
        <button @click="addToCart(lesson)" class="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lessons',
  data() {
    return {
      lessons: [],
      searchQuery: '',
      selectedSubject: '',
    }
  },
  created() {
    this.fetchLessons();
  },
  computed: {
    subjects() {
      return [...new Set(this.lessons.map(lesson => lesson.subject))];
    },
    filteredLessons() {
      let lessons = this.lessons;
      if (this.selectedSubject) {
        lessons = lessons.filter(lesson => lesson.subject === this.selectedSubject);
      }
      return lessons;
    }
  },
  methods: {
    fetchLessons() {
      fetch('/api/lessons')
        .then(response => response.json())
        .then(data => {
          this.lessons = data;
        })
        .catch(error => {
          console.error('Error fetching lessons:', error);
        });
    },
    searchLessons() {
      fetch(`/api/search?q=${this.searchQuery}`)
        .then(response => response.json())
        .then(data => {
          this.lessons = data;
        })
        .catch(error => {
          console.error('Error searching lessons:', error);
        });
    },
    addToCart(lesson) {
      this.$emit('add-to-cart', lesson)
    }
  }
}
</script>

<style scoped>
.lessons-container {
  padding: 2rem 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.search-input, .filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.lesson-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.lesson-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.lesson-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.lesson-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.lesson-info {
  padding: 1.5rem;
}

.lesson-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.lesson-info p {
  margin: 0 0 0.5rem;
  color: #666;
}

.price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.add-to-cart-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover {
  background-color: #0056b3;
}
</style>
