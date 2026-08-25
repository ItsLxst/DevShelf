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

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const orderId = session.metadata.orderId;

  await pool.query(
    `UPDATE orders SET status = 'paid' WHERE id = $1`,
    [orderId]
  );
}
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.status(200).send();
});

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

    // calculate total price
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    // create order in db (status: pending)
    const orderResult = await pool.query(
      `INSERT INTO orders (status, total) VALUES ('pending', $1) RETURNING id`,
      [total]
    );
    const orderId = orderResult.rows[0].id;

    // save each cart item into order_items
    for (const item of cart) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, 1, item.price]
      );
    }

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
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      metadata: { orderId: orderId.toString() }, // webhook needs this
    });

    // save stripe session id into order (webhook will match by this)
    await pool.query(
      `UPDATE orders SET stripe_session_id = $1 WHERE id = $2`,
      [session.id, orderId]
    );

    // send id of created session to frontend
    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});

app.get('/success', async (req, res) => {
  const sessionId = req.query.session_id;

  const orderResult = await pool.query(
    `SELECT id, status FROM orders WHERE stripe_session_id = $1`,
    [sessionId]
  );
  const order = orderResult.rows[0];

  const itemsResult = await pool.query(
    `SELECT p.title, p.file_path FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [order.id]
  );

  res.render('success', { items: itemsResult.rows });
});

app.get('/cancel', (req, res) => {
  res.render('cancel');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});