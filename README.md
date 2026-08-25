# 🛍️ DevShelf

A digital product marketplace for developers — e-books and code templates, with a cart and Stripe Checkout (test/sandbox mode) for payment.

🔗 **[Live Demo](https://devshelf-hmos.onrender.com/)**

> Note: hosted on Render's free tier, the app may take ~30 seconds to wake up on first load. Use Stripe's test card `4242 4242 4242 4242` (any future expiry, any CVC) to try checkout.

---

## ✨ Features

- Product catalog rendered server-side from a PostgreSQL database
- Category filtering (All / E-Book / Template) with instant client-side filtering
- Cart drawer: add/remove items, running total, item count on the cart button
- Stripe Checkout integration — cart items are converted into a Stripe session and the user is redirected to Stripe's hosted payment page
- Full purchase flow: cart → Stripe Checkout → webhook confirms payment → order marked as paid → download links delivered on the success page
- Orders and order items persisted in PostgreSQL, linked to Stripe sessions via metadata

---

## 🛠️ Technologies

- **Backend:** Node.js, Express
- **Templating:** EJS
- **Database:** PostgreSQL (`pg`)
- **Payments:** Stripe (Checkout Sessions, test/sandbox mode)
- **Deployment:** Render

---

## 📸 Preview

![DevShelf marketplace screenshot](./dashboard.png)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- A Stripe account (test/sandbox API keys)

### Installation

```bash
git clone https://github.com/ItsLxst/DevShelf
cd DevShelf
npm install
```

Create a `.env` file in the root:

```
DATABASE_URL=postgresql://user:password@localhost:5432/devshelf
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

Seed the database (creates the `products` table and inserts sample products):

```bash
node seed.js
```

Run the app:

```bash
node app.js
```

Open `http://localhost:3000` in your browser.

---

## 📚 What I Learned

- Integrating Stripe Checkout Sessions — mapping a cart into Stripe `line_items` and handling the redirect to Stripe's hosted payment page
- Rendering dynamic content server-side with EJS from a PostgreSQL products table
- Building client-side cart state (add/remove/update totals) with vanilla JavaScript, without a frontend framework
- Structuring a simple Express app with a separate seed script for initial database setup

---

## 🔮 Future Improvements

- [ ] Add user authentication for multi-user support (currently anonymous checkout)
- [ ] Add input validation and basic tests
- [ ] Add a `start`/`dev` script to `package.json`
- [ ] Generate signed/expiring download links instead of static file paths
