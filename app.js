import express from "express";

const app = express();
const port = 3000;

// view engine to ejs
app.set('view engine', 'ejs');

// use public folder for static files like css js images
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});