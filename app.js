import { createConnection } from "mysql2/promise";
import express from "express";
import {
  productSchema,
  supplierSchema,
  categorySchema,
  orderSchema,
  orderLineSchema,
  customerSchema,
} from "./validation.js";

const app = express();
const port = 3000;

app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "Commerce",
  port: 3306,
  multipleStatements: true,
};

// Middleware de validation
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
};

/** PRODUCTS */
// Liste des commandes et leurs lignes
app.get("/products", async (req, res) => {
  try {
    const connection = await createConnection(dbConfig);

    const [rows] = await connection.execute("SELECT * from products");

    res.json(rows);
    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
  }
});

// Ajouter un produit
app.post("/products", validate(productSchema), async (req, res) => {
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
    const connection = await createConnection(dbConfig);

    const sql =
      "INSERT INTO Products (reference, name, description, unit_price, stock_quantity, category_id, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?)";

    const [result] = await connection.execute(sql, [
      reference,
      name,
      description,
      unit_price,
      stock_quantity,
      category_id,
      supplier_id,
    ]);
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
app.patch("/products/:id", validate(productSchema), async (req, res) => {
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
    const connection = await createConnection(dbConfig);
    const sql =
      "UPDATE Products SET reference = ?, name = ?, description = ?, unit_price = ?, stock_quantity = ?, category_id = ?, supplier_id = ? WHERE product_id = ?";

    const [result] = await connection.execute(sql, [
      reference,
      name,
      description,
      unit_price,
      stock_quantity,
      category_id,
      supplier_id,
      id,
    ]);

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
    const connection = await createConnection(dbConfig);

    const sql = "DELETE FROM Products WHERE product_id = ?";

    const [result] = await connection.execute(sql, [id]);

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
    const connection = await createConnection(dbConfig);

    const [rows] = await connection.execute("SELECT * FROM Categories");

    res.json(rows);
    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
});

// Ajouter une catégorie
app.post("/categories", validate(categorySchema), async (req, res) => {
  const { name, description } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql = "INSERT INTO Categories (name, description) VALUES (?,?)";

    const [result] = await connection.execute(sql, [name, description]);
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
app.patch("/categories/:id", validate(categorySchema), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql =
      "UPDATE Categories SET name = ?, description = ? WHERE category_id = ?";

    const [result] = await connection.execute(sql, [name, description, id]);

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
    const connection = await createConnection(dbConfig);

    const sql = "DELETE FROM Categories WHERE category_id = ?";

    const [result] = await connection.execute(sql, [id]);

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
app.post("/suppliers", validate(supplierSchema), async (req, res) => {
  const { company_name, contact_name, email, phone } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql =
      "INSERT INTO Suppliers (company_name, contact_name, email, phone) VALUES (?,?,?,?)";

    const [result] = await connection.execute(sql, [
      company_name,
      contact_name,
      email,
      phone,
    ]);
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
app.patch("/suppliers/:id", validate(supplierSchema), async (req, res) => {
  const { id } = req.params;
  const { company_name, contact_name, email, phone } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql =
      "UPDATE Suppliers SET company_name = ?, contact_name = ?, email = ?, phone = ?";

    const [result] = await connection.execute(sql, [
      company_name,
      contact_name,
      email,
      phone,
      id,
    ]);

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
    const connection = await createConnection(dbConfig);

    const sql = "DELETE FROM Suppliers WHERE supplier_id = ?";

    const [result] = await connection.execute(sql, [id]);

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
    const connection = await createConnection(dbConfig);

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
app.post("/customers", validate(customerSchema), async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql =
      "INSERT INTO Customers (first_name, last_name, email, phone) VALUES (?,?,?,?)";

    const [result] = await connection.execute(sql, [
      first_name,
      last_name,
      email,
      phone,
    ]);
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
app.patch("/customers/:id", validate(customerSchema), async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql =
      "UPDATE Customers SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE customer_id = ?";

    const [result] = await connection.execute(sql, [
      first_name,
      last_name,
      email,
      phone,
      id,
    ]);

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
    const connection = await createConnection(dbConfig);

    const sql = "DELETE FROM Customers WHERE customer_id = ?";

    const [result] = await connection.execute(sql, [id]);

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
    const connection = await createConnection(dbConfig);

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
app.post("/orders", validate(orderSchema), async (req, res) => {
  const { customer_id, total_amount } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql = "INSERT INTO Orders (customer_id, total_amount) VALUES (?,?)";

    const [result] = await connection.execute(sql, [customer_id, total_amount]);
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
app.patch("/orders/:id", validate(orderSchema), async (req, res) => {
  const { id } = req.params;
  const { customer_id, total_amount } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql =
      "UPDATE Orders SET customer_id = ?, total_amount = ? WHERE order_id = ?";

    const [result] = await connection.execute(sql, [
      customer_id,
      total_amount,
      id,
    ]);

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
    const connection = await createConnection(dbConfig);

    const sql = "DELETE FROM Orders WHERE order_id = ?";

    const [result] = await connection.execute(sql, [id]);

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
app.post("/order-lines", validate(orderLineSchema), async (req, res) => {
  const { order_id, product_id, quantity, unit_price } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql =
      "INSERT INTO order_lines (order_id, product_id, quantity, unit_price) VALUES (?,?,?,?)";

    const [result] = await connection.execute(sql, [
      order_id,
      product_id,
      quantity,
      unit_price,
    ]);
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
app.patch("/order-lines/:id", validate(orderLineSchema), async (req, res) => {
  const { id } = req.params;
  const { order_id, product_id, quantity, unit_price } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    const sql =
      "UPDATE order_lines SET order_id = ?, product_id = ?, quantity = ?, unit_price = ? WHERE order_line_id = ?";

    const [result] = await connection.execute(sql, [
      order_id,
      product_id,
      quantity,
      unit_price,
      id,
    ]);

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
    const connection = await createConnection(dbConfig);

    const sql = "DELETE FROM Order_Lines WHERE order_line_id = ?";

    const [result] = await connection.execute(sql, [id]);

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

/** FONCTIONS AVANCES */

// Commande par année
app.get("/commandes", async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res
      .status(400)
      .json({ error: 'Les paramètres "start" et "end" sont obligatoires.' });
  }

  try {
    const connection = await createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT 
                order_id, 
                customer_id, 
                order_date, 
                total_amount 
             FROM 
                Orders 
             WHERE 
                order_date BETWEEN ? AND ?
             ORDER BY 
                order_date ASC`,
      [start, end]
    );

    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Commande d'un client spécifique
app.get("/customers/:id/orders", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "L'ID du client est obligatoire." });
  }

  try {
    const connection = await createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT 
                o.order_id, 
                o.order_date, 
                o.total_amount 
             FROM 
                Orders o 
             WHERE 
                o.customer_id = ? 
             ORDER BY 
                o.order_date DESC`,
      [id]
    );

    await connection.end();

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune commande trouvée pour ce client." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Commande pour un article précis
app.get("/products/:id/orders", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "L'ID du produit est obligatoire." });
  }

  try {
    const connection = await createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT 
                o.order_id, 
                o.order_date, 
                o.total_amount, 
                ol.product_id, 
                ol.quantity, 
                ol.unit_price
             FROM 
                Order_Lines ol
             JOIN 
                Orders o ON ol.order_id = o.order_id
             WHERE 
                ol.product_id = ? 
             ORDER BY 
                o.order_date DESC`,
      [id]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Aucune commande contenant ce produit n'a été trouvée.",
      });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Recherche multi-critères
app.get("/search/orders", async (req, res) => {
  const { customerId, startDate, endDate, productId } = req.query;

  try {
    const connection = await createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT 
                o.order_id, 
                o.order_date, 
                o.total_amount, 
                c.first_name, 
                c.last_name, 
                ol.product_id, 
                p.name AS product_name, 
                ol.quantity, 
                ol.unit_price
             FROM 
                Orders o
             JOIN 
                Customers c ON o.customer_id = c.customer_id
             JOIN 
                Order_Lines ol ON o.order_id = ol.order_id
             JOIN 
                Products p ON ol.product_id = p.product_id
             WHERE 
                (c.customer_id = ? OR ? IS NULL) AND
                (o.order_date BETWEEN ? AND ? OR (? IS NULL AND ? IS NULL)) AND
                (p.product_id = ? OR ? IS NULL)
             ORDER BY 
                o.order_date DESC`,
      [
        customerId || null,
        customerId || null,
        startDate || null,
        endDate || null,
        startDate || null,
        endDate || null,
        productId || null,
        productId || null,
      ]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Aucune commande trouvée pour les critères spécifiés.",
      });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Statistiques: Produits les plus vendus
app.get("/stats/top-products", async (req, res) => {
  try {
    const connection = await createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT 
                p.product_id, 
                p.name AS product_name, 
                SUM(ol.quantity) AS total_quantity
             FROM 
                Order_Lines ol
             JOIN 
                Products p ON ol.product_id = p.product_id
             GROUP BY 
                p.product_id, p.name
             ORDER BY 
                total_quantity DESC
             LIMIT 10`
    );

    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Statistiques : Total des ventes sur une période donnée
app.get("/stats/total-sales", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Les dates de début et de fin sont obligatoires." });
  }

  try {
    const connection = await createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT 
                SUM(ol.quantity * ol.unit_price) AS total_sales
             FROM 
                Order_Lines ol
             JOIN 
                Orders o ON ol.order_id = o.order_id
             WHERE 
                o.order_date BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    await connection.end();

    const totalSales = rows[0].total_sales || 0;
    res.status(200).json({ total_sales: totalSales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur http://localhost:${port}`);
});
