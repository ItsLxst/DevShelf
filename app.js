import express from "express";
import pool from "./db.js";

const app = express();
const port = 3000;

// view engine to ejs
app.set('view engine', 'ejs');

// use public folder for static files like css js images
app.use(express.static('public'));

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});