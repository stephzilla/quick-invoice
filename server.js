require('dotenv').config();
const express = require('express');
const { createPaymentLink } = require('./stripeAdapter');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '/')));

app.post('/create-payment-link', async (req, res) => {
    const { hourlyRate, quantity } = req.body;
    try {
        const paymentLink = await createPaymentLink(hourlyRate, quantity);
        console.log("PAYMENT LINK: " + paymentLink)
        res.json({ paymentLink });
    } catch (error) {
        console.log("There as an error: " + error.message);
        res.status(500).json({ error: 'Failed to create payment link' });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));