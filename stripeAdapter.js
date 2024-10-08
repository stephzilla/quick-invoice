const stripe = required('stripe')(process.env.STRIPE_SECRET_KEY);   

async function createPaymentLink(hourlyRate, quantity) {
    try {
        const product = await stripe.products.create({
            name: 'Invoice Payment',
        });

        const price = await stripe.paymentLinks.create({
            line_items: [
                {
                    price: price.id,
                    quantity: quantity,
                },             
            ],
            node: 'payment',
        });

        return paymentLink.url;
    } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
    }
}

module.exports = {
    createPaymentLink,
};