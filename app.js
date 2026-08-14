import express from "express";
import pool from "./db.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// make it async, get db and send to ejs
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    const products = result.rows;
    res.render('index', { products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

// stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    // take cart 
    const { cart } = req.body;

    // cart -> lineItems (Stripe)
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
        },
        unit_amount: item.price * 100, // convert dollar to cent
      },
      quantity: 1, // quantity 1 per product
    }));

    // stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:3000/success`, // payment successful
      cancel_url: `http://localhost:3000/cancel`,   // payment cancel
    });

    // send id of created session to frontend
    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});