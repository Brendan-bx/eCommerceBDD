# Explication du projet

Dans le cadre d'un stage pour une entreprise de e-commerce, j'ai réalisé un projet permettant de faire la gestion de leur stock.

Les requêtes mises en place peuvent lister, créer, modifier ou supprimer les nombreuses tables présentes dans la base de données.

## Version 1

Après la sortie de notre première version du projet, j'ai pu remarqué que les requêtes n'étaient pas du tout sécurisés, manque de validation de champs et de qualité de la base de données.

Dans une future version, nous pourrons ajouter des vérifications de champs pour éviter d'avoir des champs vides par exemple, des valeurs négatives ou empêcher les injections SQL

### Exemple d'injection sql

Dans la méthode PATCH ou DELETE de la table Products `http://localhost:3000/products/1; DROP DATABASE commerce -- '` pour supprimer la base de données par exemple.
Mais encore dans une méthode PATCH uniquement de la table Products `http://localhost:3000/products/1 OR 1=1; --` pour modifier toute la table avec nos élements indiqués

Exemple de JSON utilisé :

```JSON
{
  "reference": "newRef123",
  "name": "newProductName",
  "description": "This is a new description",
  "unit_price": 19.99,
  "stock_quantity": 100,
  "category_id": 2,
  "supplier_id": 3
}
```

## Version 2

## 1. Schéma de la base de données

### Entités et relations (voir `database_schema.md`)

#### Categories

- **category_id** (PK, int) : Identifiant unique
- **name** (varchar) : Nom de la catégorie
- **description** (text) : Description détaillée
- Relation: Une catégorie peut contenir plusieurs produits (1:n)

#### Suppliers

- **supplier_id** (PK, int) : Identifiant unique
- **company_name** (varchar) : Nom de l'entreprise
- **contact_name** (varchar) : Nom du contact
- **email** (varchar) : Email du fournisseur
- **phone** (varchar) : Numéro de téléphone
- Relation: Un fournisseur peut fournir plusieurs produits (1:n)

#### Products

- **product_id** (PK, int) : Identifiant unique
- **reference** (varchar) : Référence produit
- **name** (varchar) : Nom du produit
- **description** (text) : Description détaillée
- **unit_price** (decimal) : Prix unitaire
- **stock_quantity** (int) : Quantité en stock
- **category_id** (FK, int) : Référence vers Categories
- **supplier_id** (FK, int) : Référence vers Suppliers
- Relations:
  - Appartient à une catégorie (n:1)
  - Est fourni par un fournisseur (n:1)
  - Peut apparaître dans plusieurs lignes de commande (1:n)

#### Customers

- **customer_id** (PK, int) : Identifiant unique
- **first_name** (varchar) : Prénom
- **last_name** (varchar) : Nom
- **email** (varchar) : Email
- **phone** (varchar) : Téléphone
- **created_at** (timestamp) : Date de création
- Relation: Un client peut passer plusieurs commandes (1:n)

#### Orders

- **order_id** (PK, int) : Identifiant unique
- **customer_id** (FK, int) : Référence vers Customers
- **order_date** (timestamp) : Date de la commande
- **total_amount** (decimal) : Montant total
- Relations:
  - Appartient à un client (n:1)
  - Contient plusieurs lignes de commande (1:n)

#### Order_Lines

- **order_line_id** (PK, int) : Identifiant unique
- **order_id** (FK, int) : Référence vers Orders
- **product_id** (FK, int) : Référence vers Products
- **quantity** (int) : Quantité commandée
- **unit_price** (decimal) : Prix unitaire
- Relations:
  - Fait partie d'une commande (n:1)
  - Référence un produit (n:1)

## 2. Endpoints

### Products

#### GET /products

Liste tous les produits

```http
GET /products
```

Retour:

```json
[
  {
    "product_id": 1,
    "reference": "REF001",
    "name": "Produit 1",
    "description": "Description",
    "unit_price": 19.99,
    "stock_quantity": 100,
    "category_id": 1,
    "supplier_id": 1
  }
]
```

#### POST /products

Ajoute un nouveau produit

```json
{
  "reference": "REF001",
  "name": "Nouveau Produit",
  "description": "Description",
  "unit_price": 19.99,
  "stock_quantity": 100,
  "category_id": 1,
  "supplier_id": 1
}
```

#### PATCH /products/:id

Met à jour un produit existant

```json
{
  "reference": "ADD01",
  "name": "Nouveau Produit",
  "description": "Description",
  "unit_price": 19.99,
  "stock_quantity": 100,
  "category_id": 1,
  "supplier_id": 1
}
```

#### DELETE /products/:id

Supprime un produit

```http
DELETE /products/1
```

### Categories

#### GET /categories

Liste toutes les catégories

```http
GET /categories
```

#### POST /categories

Crée une nouvelle catégorie

```json
{
  "name": "Électronique",
  "description": "Produits électroniques"
}
```

#### PATCH /Categories/:id

Met à jour une catégorie existante

```json
{
  "name": "Electrique",
  "description": "Produits électriques"
}
```

#### DELETE /Categories/:id

Supprime une catégorie existante

```http
DELETE /Categories/2
```

### Suppliers

##### POST /suppliers

Ajoute un fournisseur

```json
{
  "company_name": "Arasaka",
  "contact_name": "Johnny Silverhand",
  "email": "johnny.silverhand@arasaka.com",
  "phone": "0102030405"
}
```

#### PATCH /suppliers/:id

Met à jour un fournisseur existant

```json
{
  "company_name": "Arasaka",
  "contact_name": "Yorinobu Arasaka",
  "email": "Yorinobu@arasaka.com",
  "phone": "0102030405"
}
```

#### DELETE /suppliers/:id

```http
DELETE /suppliers/1
```

### Customers

#### GET /customers

Liste les clients avec leurs commandes

```http
GET /customers
```

Retour:

```json
[
  {
    "first_name": "John",
    "last_name": "Doe",
    "order_id": 1,
    "order_date": "2024-01-14",
    "total_amount": 299.97
  }
]
```

#### POST /customers

Ajoute un nouveau client

```json
{
  "first_name": "Judy",
  "last_name": "Alvarez",
  "email": "judy.alvarez@gmail.com",
  "phone": "0102030405"
}
```

#### PATCH /customers/:id

Met à jour un client existant

```json
{
  "first_name": "V",
  "last_name": "V",
  "email": "V@gmail.com",
  "phone": "0102030405"
}
```

#### DELETE /customers/:id

Supprime un client existant

```http
DELETE /customers/1
```

### Orders

#### GET /orders

Liste les commandes avec leurs lignes

```http
GET /orders
```

Retour:

```json
[
  {
    "order_id": 1,
    "order_date": "2024-01-14",
    "total_amount": 299.97,
    "order_line_id": 1,
    "product_id": 1,
    "product_name": "Produit 1",
    "quantity": 3,
    "unit_price": 99.99,
    "line_total": 299.97
  }
]
```

#### POST /orders

Ajoute une commande

```json
{
  "customer_id": "3",
  "total_amount": "1999.99"
}
```

#### PATCH /orders/:id

Met à jour une commande existante

```json
{
  "customer_id": "3",
  "total_amount": "2999.99"
}
```

#### DELETE /orders/:id

Supprime une commande existante

```http
DELETE /orders/3
```

#### POST /order-lines

Ajoute une ligne de commande

```json
{
  "order_id": "4",
  "product_id": "6",
  "quantity": "5",
  "unit_price": "5.99"
}
```

#### PATCH /order-lines/:id

Met à jour une ligne de commande existante

```json
{
  "order_id": "4",
  "product_id": "6",
  "quantity": "5",
  "unit_price": "15.99"
}
```

#### DELETE /order-lines/:id

Supprime une ligne de commande existante

```http
DELETE /order-lines/31
```

### Fonctionnalités avancées

#### GET /commandes

Recherche des commandes par période

```http
GET /commandes?start=2024-01-01&end=2025-01-31
```

#### GET /customers/:id/orders

Liste les commandes d'un client spécifique

```http
GET /customers/5/orders
```

#### GET /products/:id/orders

Liste les commandes contenant un produit spécifique

```http
GET /products/1/orders
```

#### GET /search/orders

Recherche multi-critères de commandes

```http
GET /search/orders?startDate=2024-01-01&endDate=2024-01-31&productId=16
```

#### GET /stats/top-products

Top 10 des produits les plus vendus

```http
GET /stats/top-products
```

Retour:

```json
[
  {
    "product_id": 1,
    "product_name": "Produit 1",
    "total_quantity": 150
  }
]
```

#### GET /stats/total-sales

Total des ventes sur une période

```http
GET /stats/total-sales?startDate=2024-01-01&endDate=2025-01-31
```

Retour:

```json
{
  "total_sales": 15000.5
}
```

## Audit

Dans la version 1, j'ai rencontré des problèmes de validations et de cas d'injections sql que j'ai réussi à corriger dans cette 2e version.

Pour la validation, j'ai décidé d'utiliser Yup qui nous aide pour les types des champs de la base de données, un nombre de caractères minimum et maximum par exemple.

Et pour empêcher les injections sql, j'ai utilisé des requêtes préparés.

En axe d'amélioration pour renforcer la sécurité de notre base de données, je pourrais dans le futur, limiter les privilègesde la base de données pour éviter les `DROP TABLE` par exemple.

Ou l'utilisation d'un ORM qui gèrent automatiquement des requêtes sécurisés
