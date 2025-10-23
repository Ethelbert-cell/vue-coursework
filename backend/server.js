require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware for parsing JSON bodies
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let lessonsCollection;
let ordersCollection;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const db = client.db("class-booking-app");
    lessonsCollection = db.collection("lessons");
    ordersCollection = db.collection("orders");
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas", err);
    process.exit(1);
  }
}

// Get all lessons with sorting
app.get('/api/lessons', async (req, res) => {
  try {
    const { sortBy, order } = req.query;
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    }
    const lessons = await lessonsCollection.find({}).sort(sortOptions).toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).send('Error fetching lessons');
  }
});

// Save an order and update lesson spaces
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;

    // Validate order
    if (!order.name || !order.phone || !order.cart) {
      return res.status(400).send('Invalid order format');
    }

    // Array to hold bulk write operations
    const bulkOps = order.cart.map(item => ({
      updateOne: {
        filter: { _id: new ObjectId(item.lessonId) },
        update: { $inc: { spaces: -item.spaces } }
      }
    }));

    // Execute bulk write to update spaces
    await lessonsCollection.bulkWrite(bulkOps);

    // Insert the order
    const result = await ordersCollection.insertOne({
      name: order.name,
      phone: order.phone,
      lessons: order.cart.map(item => ({ lessonId: new ObjectId(item.lessonId), spaces: item.spaces })),
      createdAt: new Date()
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).send('Error saving order');
  }
});

// Update lesson spaces
app.put('/api/lessons/:id', async (req, res) => {
  try {
    const lessonId = new ObjectId(req.params.id);
    const { spaces } = req.body;
    const result = await lessonsCollection.updateOne({ _id: lessonId }, { $set: { spaces } });
    res.json(result);
  } catch (err) {
    res.status(500).send('Error updating lesson');
  }
});

// Search for lessons
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    const results = await lessonsCollection.find({
      $or: [
        { subject: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    res.json(results);
  } catch (err) {
    res.status(500).send('Error searching lessons');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  connectDB();
});
