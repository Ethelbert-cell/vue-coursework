const express = require('express');
const app = express();
const port = 3000;

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware for parsing JSON bodies
app.use(express.json());

// Dummy data
let lessons = [
  { id: 1, subject: 'Mathematics', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' },
  { id: 2, subject: 'English', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' },
  { id: 3, subject: 'Science', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' },
  { id: 4, subject: 'History', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' },
  { id: 5, subject: 'Geography', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' },
  { id: 6, subject: 'Art', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' },
  { id: 7, subject: 'Music', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' },
  { id: 8, subject: 'Physical Education', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' },
  { id: 9, subject: 'Computer Science', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' },
  { id: 10, subject: 'Drama', location: 'London', price: 100, spaces: 5, image: 'https://via.placeholder.com/150' }
];

let orders = [];

// Get all lessons
app.get('/api/lessons', (req, res) => {
  res.json(lessons);
});

// Save an order
app.post('/api/orders', (req, res) => {
  const order = req.body;
  orders.push(order);
  res.status(201).json(order);
});

// Update lesson spaces
app.put('/api/lessons/:id', (req, res) => {
  const lessonId = parseInt(req.params.id);
  const { spaces } = req.body;
  const lesson = lessons.find(l => l.id === lessonId);
  if (lesson) {
    lesson.spaces = spaces;
    res.json(lesson);
  } else {
    res.status(404).send('Lesson not found');
  }
});

// Search for lessons
app.get('/api/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const results = lessons.filter(lesson =>
    lesson.subject.toLowerCase().includes(query) ||
    lesson.location.toLowerCase().includes(query)
  );
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
