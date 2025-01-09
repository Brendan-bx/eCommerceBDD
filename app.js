const mysql = require("mysql2/promise");
const express = require("express");

const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "Commerce",
  port: 3306,
  multipleStatements: true,
};

/** PRODUCTS */
// Liste des commandes et leurs lignes
app.get("/products", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute("SELECT * from products");

    res.json(rows);
    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
  }
});

// Ajouter un produit
app.post("/products", async (req, res) => {
  const {
    reference,
    name,
    description,
    unit_price,
    stock_quantity,
    category_id,
    supplier_id,
  } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `INSERT INTO Products (reference, name, description, unit_price, stock_quantity, category_id, supplier_id)
                 VALUES ('${reference}', '${name}', '${description}', ${unit_price}, ${stock_quantity}, ${category_id}, ${supplier_id})`;

    const [result] = await connection.query(sql);
    res.status(201).json({
      message: "Produit ajouté avec succès.",
      productId: result.insertId,
    });

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Mettre à jour un produit
app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const {
    reference,
    name,
    description,
    unit_price,
    stock_quantity,
    category_id,
    supplier_id,
  } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log(id);
    const sql = `UPDATE Products 
                 SET reference = '${reference}', name = '${name}', description = '${description}', unit_price = ${unit_price}, stock_quantity = ${stock_quantity}, category_id = ${category_id}, supplier_id = ${supplier_id}
                 WHERE product_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Produit non trouvé." });
    } else {
      res.status(200).json({ message: "Produit mis à jour avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du produit." });
  }
});

// Supprimer un produit
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `DELETE FROM Products WHERE product_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Produit non trouvé." });
    } else {
      res.status(200).json({ message: "Produit supprimé avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du produit." });
  }
});

/** CATEGORIES */
// Lister les catégories
app.get("/categories", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.query("SELECT * FROM Categories");

    res.json(rows);
    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
});

// Ajouter une catégorie
app.post("/categories", async (req, res) => {
  const { name, description } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `INSERT INTO Categories (name, description)
                 VALUES ('${name}', '${description}')`;

    const [result] = await connection.query(sql);
    res.status(201).json({
      message: "Catégorie ajoutée avec succès.",
      categoryId: result.insertId,
    });

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de l'ajout de la catégorie :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Mettre à jour une catégorie
app.patch("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `UPDATE Categories 
                 SET name = '${name}', description = '${description}'
                 WHERE category_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Catégorie non trouvée." });
    } else {
      res.status(200).json({ message: "Catégorie mise à jour avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la catégorie." });
  }
});

// Supprimer une catégorie
app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `DELETE FROM Categories WHERE category_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Catégorie non trouvée." });
    } else {
      res.status(200).json({ message: "Catégorie supprimée avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la catégorie." });
  }
});

/** SUPPLIERS */

// Ajouter un fournisseur
app.post("/suppliers", async (req, res) => {
  const { company_name, contact_name, email, phone } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `INSERT INTO Suppliers (company_name, contact_name, email, phone)
                 VALUES ('${company_name}', '${contact_name}', '${email}', '${phone}')`;

    const [result] = await connection.query(sql);
    res.status(201).json({
      message: "Fournisseur ajouté avec succès.",
      supplierId: result.insertId,
    });

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de l'ajout du fournisseur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Mettre à jour un fournisseur
app.patch("/suppliers/:id", async (req, res) => {
  const { id } = req.params;
  const { company_name, contact_name, email, phone } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `UPDATE Suppliers 
                 SET company_name = '${company_name}', contact_name = '${contact_name}', email = '${email}', phone = '${phone}'
                 WHERE supplier_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Fournisseur non trouvé." });
    } else {
      res.status(200).json({ message: "Fournisseur mis à jour avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du fournisseur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du fournisseur." });
  }
});

// Supprimer un fournisseur
app.delete("/suppliers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `DELETE FROM Suppliers WHERE supplier_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Fournisseur non trouvé." });
    } else {
      res.status(200).json({ message: "Fournisseur supprimé avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la suppression du fournisseur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du fournisseur." });
  }
});

/** CUSTOMERS */
// Lister les clients avec leurs commandes
app.get("/customers", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT c.first_name, c.last_name, o.order_id, o.order_date, o.total_amount FROM customers c JOIN orders o ON c.customer_id = o.customer_id"
    );

    res.json(rows);
    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
  }
});

// Ajouter un client
app.post("/customers", async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `INSERT INTO Customers (first_name, last_name, email, phone)
                 VALUES ('${first_name}', '${last_name}', '${email}', '${phone}')`;

    const [result] = await connection.query(sql);
    res.status(201).json({
      message: "Client ajouté avec succès.",
      customerId: result.insertId,
    });

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de l'ajout du client :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Mettre à jour un client
app.patch("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `UPDATE Customers 
                 SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', phone = '${phone}'
                 WHERE customer_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Client non trouvé." });
    } else {
      res.status(200).json({ message: "Client mis à jour avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du client." });
  }
});

// Supprimer un client
app.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `DELETE FROM Customers WHERE customer_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Client non trouvé." });
    } else {
      res.status(200).json({ message: "Client supprimé avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la suppression du client :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du client." });
  }
});

/** ORDERS */
// Liste des commandes et leurs lignes
app.get("/orders", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT Orders.order_id AS order_id, Orders.order_date AS order_date, Orders.total_amount AS total_amount, Order_Lines.order_line_id AS order_line_id, Order_Lines.product_id AS product_id, Products.name AS product_name, Order_Lines.quantity AS quantity, Order_Lines.unit_price AS unit_price, (Order_Lines.quantity * Order_Lines.unit_price) AS line_total FROM Orders INNER JOIN Order_Lines ON Orders.order_id = Order_Lines.order_id INNER JOIN Products ON Order_Lines.product_id = Products.product_id;"
    );

    res.json(rows);
    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
  }
});

// Ajouter une commande
app.post("/orders", async (req, res) => {
  const { customer_id, total_amount } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `INSERT INTO Orders (customer_id, total_amount)
                 VALUES (${customer_id}, ${total_amount})`;

    const [result] = await connection.query(sql);
    res.status(201).json({
      message: "Commande ajoutée avec succès.",
      orderId: result.insertId,
    });

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de l'ajout de la commande :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Mettre à jour une commande
app.patch("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { customer_id, total_amount } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `UPDATE Orders 
                 SET customer_id = ${customer_id}, total_amount = ${total_amount}
                 WHERE order_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Commande non trouvée." });
    } else {
      res.status(200).json({ message: "Commande mise à jour avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la commande." });
  }
});

// Supprimer une commande
app.delete("/orders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `DELETE FROM Orders WHERE order_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Commande non trouvée." });
    } else {
      res.status(200).json({ message: "Commande supprimée avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la commande." });
  }
});

/** ORDER_LINE */
// Ajouter une ligne de commande
app.post("/order-lines", async (req, res) => {
  const { order_id, product_id, quantity, unit_price } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `INSERT INTO Order_Lines (order_id, product_id, quantity, unit_price)
                 VALUES (${order_id}, ${product_id}, ${quantity}, ${unit_price})`;

    const [result] = await connection.query(sql);
    res.status(201).json({
      message: "Ligne de commande ajoutée avec succès.",
      orderLineId: result.insertId,
    });

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de l'ajout de la ligne de commande :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Mettre à jour une ligne de commande
app.patch("/order-lines/:id", async (req, res) => {
  const { id } = req.params;
  const { order_id, product_id, quantity, unit_price } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `UPDATE Order_Lines 
                 SET order_id = ${order_id}, product_id = ${product_id}, quantity = ${quantity}, unit_price = ${unit_price}
                 WHERE order_line_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Ligne de commande non trouvée." });
    } else {
      res
        .status(200)
        .json({ message: "Ligne de commande mise à jour avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la ligne de commande :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la mise à jour de la ligne de commande.",
    });
  }
});

// Supprimer une ligne de commande
app.delete("/order-lines/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `DELETE FROM Order_Lines WHERE order_line_id = ${id}`;

    const [result] = await connection.query(sql);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Ligne de commande non trouvée." });
    } else {
      res
        .status(200)
        .json({ message: "Ligne de commande supprimée avec succès." });
    }

    await connection.end();
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la ligne de commande :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la suppression de la ligne de commande.",
    });
  }
});

app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur http://localhost:${port}`);
});
