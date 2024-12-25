const express = require('express');
const connectToMongo = require('./db');  // MongoDB connection
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectToMongo();

// Routes
app.use('/api/auth', require('./Routes/Auth'));  // Authentication routes
app.use('/api/order', require('./Routes/Order'));  // Order route for placing orders

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});




