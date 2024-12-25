const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        // Removed unique: true since a user can place multiple orders
    },
    order_data: {
        type: Array,
        required: true,
    },
}, { timestamps: true }); // Add timestamps to track order creation time

module.exports = mongoose.model('order', OrderSchema);



