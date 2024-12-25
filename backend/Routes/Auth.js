const express = require('express');
const User = require('../models/User');
const Order = require('../models/Orders');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fetchuser = require('../middleware/fetchdetails'); 


const jwtSecret = "HaHa";

// Creating a user and storing data to MongoDB Atlas, No Login Required
router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password, salt);

    try {
        await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email,
            location: req.body.location
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            };
            const authToken = jwt.sign(data, jwtSecret);
            success = true;
            res.json({ success, authToken });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "Please enter a unique value." });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

// Authentication a User, No login Required
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        };
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

// Get logged in User details, Login Required.
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error." });
    }
});

// Get location from latitude and longitude
router.post('/getlocation', async (req, res) => {
    try {
        const { lat, long } = req.body.latlong;
        
        let location = await axios
            .get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`)
            .then(response => {
                const components = response.data.results[0].components;

                // Only include non-empty components in the final address
                const addressParts = [
                    components.village,
                    components.county,
                    components.state_district,
                    components.state,
                    components.postcode
                ].filter(Boolean); // This removes any undefined or empty strings

                return addressParts.join(', '); // Join the non-empty parts with commas
            })
            .catch(error => {
                console.error("Error fetching data from OpenCage API: ", error);
                return "Unknown location";
            });

        res.json({ location });
    } catch (error) {
        console.error("Server error: ", error.message);
        res.status(500).json({ message: "Server error." });
    }
});


// Food data endpoint
router.post('/foodData',(req,res)=>{
    try{
       console.log(global.appetite_items);
       res.send([global.appetite_items, global.appetiteCategory])
    }catch(error){
       console.error(error.message);
       res.send("Server Error");
    }
})

// Order submission endpoint
router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;
    data.splice(0, 0, { Order_date: req.body.order_date });

    let eId = await Order.findOne({ 'email': req.body.email });
    if (eId === null) {
        try {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
            res.json({ success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: "Server error." });
        }
    } else {
        try {
            await Order.findOneAndUpdate({ email: req.body.email }, { $push: { order_data: data } });
            res.json({ success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: "Server error." });
        }
    }
});


// Retrieve user's order data
router.post('/myOrderData', async (req, res) => {
    try {
        let eId = await Order.findOne({ 'email': req.body.email });
        if (!eId || !eId.order_data || eId.order_data.length === 0) {
            return res.json({ orderData: [] });  // Return an empty array if no orders found
        }
        res.json({ orderData: eId.order_data });  // Send back the correct order data
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error." });
    }
});


// Route to place an order
router.post('/placeorder', fetchuser, async (req, res) => {
    try {
        const email = req.user.email;
        const { order_data } = req.body;

        if (!order_data || order_data.length === 0) {
            return res.status(400).json({ error: "No order data provided" });
        }

        // Add the current date and time when placing the order
        const newOrder = new Order({
            email: email,
            order_data: [{ Order_date: new Date(), ...order_data }]
        });

        await newOrder.save();
        res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;







