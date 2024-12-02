const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Define pricing plans (amount in paise)
const plans = {
    premium: 1000,
    business: 5000,
    developer: 10000,
};

// API to create Razorpay orders
app.post('/create-order', async (req, res) => {
    const { plan } = req.body;
    const amount = plans[plan];

    if (!amount) {
        return res.status(400).json({ error: 'Invalid plan selected' });
    }

    try {
        const order = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        });
        res.json({
            key: process.env.RAZORPAY_KEY_ID,
            amount,
            currency: 'INR',
            orderId: order.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
