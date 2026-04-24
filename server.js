const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// GET all products
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// POST new product
app.post("/api/products", (req, res) => {
  const { product, price } = req.body;

  db.run(
    "INSERT INTO products (product, price) VALUES (?, ?)",
    [product, price],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID, product, price });
    }
  );
});


// ✅ ADD THIS: GET single product
app.get("/api/products/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json(err);
    res.json(row);
  });
});


// ✅ ADD THIS: UPDATE product
app.put("/api/products/:id", (req, res) => {
  const { product, price } = req.body;

  db.run(
    "UPDATE products SET product = ?, price = ? WHERE id = ?",
    [product, price, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});


// ✅ ADD THIS: DELETE product
app.delete("/api/products/:id", (req, res) => {
  db.run(
    "DELETE FROM products WHERE id = ?",
    req.params.id,
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    }
  );
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});