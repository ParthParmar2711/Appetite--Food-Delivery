const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const fetchuser = require('../middleware/fetchdetails'); // Middleware to fetch user from token

// Route to place an order
router.post('/placeorder', fetchuser, async (req, res) => {
    try {
        const email = req.user.email; 
        const { order_data } = req.body;

        if (!order_data || order_data.length === 0) {
            return res.status(400).json({ error: "No order data provided" });
        }

        // Create a new order for the authenticated user
        const newOrder = new Order({
            email: email, // Storing the correct email from the authenticated user
            order_data: [{ Order_date: new Date(), ...order_data }]  // Include current date and time
        });

        await newOrder.save();
        res.json({ success: true, message: "Order placed successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
