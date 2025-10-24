require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware for parsing JSON bodies
app.use(express.json());

// Static file middleware for images
app.use('/images', express.static('images'));

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let lessonsCollection;
let ordersCollection;

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const db = client.db("class-booking-app");
    lessonsCollection = db.collection("lessons");
    ordersCollection = db.collection("orders");

    // Start the server only after the database connection is established
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });

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

// Save a new order
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;

    // Basic validation
    if (!order.name || !order.phone || !order.cart || !Array.isArray(order.cart)) {
      return res.status(400).send('Invalid order format');
    }

    // Insert the new order
    const result = await ordersCollection.insertOne({
      name: order.name,
      phone: order.phone,
      lessons: order.cart.map(item => ({ lessonId: new ObjectId(item._id), spaces: 1 })),
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
    // Using a text index for a more natural search.
    // This requires creating a text index in MongoDB Atlas on the desired fields.
    // For example: { "subject": "text", "location": "text" }
    const results = await lessonsCollection.find({ $text: { $search: query } }).toArray();
    res.json(results);
  } catch (err) {
    // Fallback to regex search if text index is not set up or fails
    console.warn("Text search failed, falling back to regex. Consider setting up a text index in MongoDB Atlas.", err);
    try {
      const query = req.query.q;
      const searchCriteria = [
        { subject: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ];
      const numericQuery = parseInt(query);
      if (!isNaN(numericQuery)) {
        searchCriteria.push({ price: numericQuery });
        searchCriteria.push({ spaces: numericQuery });
      }
      const results = await lessonsCollection.find({ $or: searchCriteria }).toArray();
      res.json(results);
    } catch (regexErr) {
      res.status(500).send('Error searching lessons');
    }
  }
});

main();
