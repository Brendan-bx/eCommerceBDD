-- Table des catégories
CREATE TABLE IF NOT EXISTS Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Table des fournisseurs
CREATE TABLE IF NOT EXISTS Suppliers (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- Table des Produits
CREATE TABLE IF NOT EXISTS Products (
  product_id INT PRIMARY KEY AUTO_INCREMENT, 
  reference VARCHAR(50) NOT NULL,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  unit_price DECIMAL(10,2),
  stock_quantity INT NOT NULL DEFAULT 0,
  category_id INT,
  supplier_id INT,
  FOREIGN KEY (category_id) REFERENCES Categories(category_id),
  FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
);


-- Table des clients
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Table des lignes de commande
CREATE TABLE IF NOT EXISTS Order_Lines (
    order_line_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);


-- Insertion des catégories
INSERT INTO Categories (name, description) VALUES
('Informatique', 'Produits informatiques et accessoires'),
('Téléphonie', 'Smartphones et accessoires'),
('Audio', 'Casques et enceintes'),
('Gaming', 'Consoles et jeux vidéo'),
('Réseau', 'Équipements réseau et connectivité'),
('Photo', 'Appareils photo et accessoires'),
('TV/Vidéo', 'Télévisions et équipements vidéo'),
('Domotique', 'Objets connectés pour la maison'),
('Tablettes', 'Tablettes et accessoires'),
('Composants PC', 'Composants pour ordinateurs');

-- Insertion des fournisseurs
INSERT INTO Suppliers (company_name, contact_name, email, phone) VALUES
('HP France', 'Jean Dupont', 'jean.dupont@hp.com', '0123456789'),
('Apple Store', 'Marie Tremblay', 'marie.tremblay@apple.com', '0234567890'),
('Sony France', 'Pierre Martin', 'pierre.martin@sony.com', '0345678901'),
('Microsoft France', 'Sophie Duval', 'sophie.duval@microsoft.com', '0456789012'),
('Cisco Systems', 'Lucas Leroy', 'lucas.leroy@cisco.com', '0567890123'),
('Canon France', 'Emma Garnier', 'emma.garnier@canon.com', '0678901234'),
('Samsung Electronics', 'Thomas Renault', 'thomas.renault@samsung.com', '0789012345'),
('Nest France', 'Julie Morel', 'julie.morel@nest.com', '0890123456'),
('Asus France', 'Antoine Blanc', 'antoine.blanc@asus.com', '0901234567'),
('Corsair Components', 'Céline Petit', 'celine.petit@corsair.com', '0912345678');

-- Insertion des produits
INSERT INTO Products (reference, name, description, unit_price, stock_quantity, category_id, supplier_id) VALUES
('REF001', 'HP Spectre x360', 'Ordinateur portable haute performance', 1599.99, 50, 1, 1),
('REF002', 'iPhone 15 Pro', 'Smartphone dernière génération', 1299.99, 100, 2, 2),
('REF003', 'Sony WH-1000XM5', 'Casque bluetooth sans fil', 399.99, 75, 3, 3),
('REF004', 'Xbox Series X', 'Console de jeux dernière génération', 499.99, 30, 4, 4),
('REF005', 'Cisco Router AX9000', 'Routeur wifi 6', 259.99, 45, 5, 5),
('REF006', 'Canon EOS R5', 'Appareil photo professionnel', 4499.99, 20, 6, 6),
('REF007', 'Samsung QLED 55"', 'Télévision connectée 55 pouces', 1399.99, 25, 7, 7),
('REF008', 'Nest Thermostat E', 'Thermostat intelligent', 199.99, 60, 8, 8),
('REF009', 'Asus ROG Flow Z13', 'Tablette haut de gamme', 2499.99, 40, 9, 9),
('REF010', 'Corsair Ryzen 9', 'Processeur haute performance', 499.99, 35, 10, 10),
('REF011', 'Corsair Scimitar Elite', 'Souris pour gamer', 89.99, 120, 10, 10),
('REF012', 'Apple MagSafe Case', 'Coque protection smartphone', 59.99, 200, 2, 2),
('REF013', 'Sony SRS-XE300', 'Enceinte bluetooth portable', 149.99, 80, 3, 3),
('REF014', 'Xbox Elite Controller', 'Manette gaming pro', 199.99, 90, 4, 4),
('REF015', 'Cisco PoE Switch', 'Switch réseau POE', 299.99, 40, 5, 5),
('REF016', 'Canon EF 50mm', 'Objectif photo professionnel', 1099.99, 25, 6, 6),
('REF017', 'Samsung Soundbar HW-Q800C', 'Barre de son home cinéma', 799.99, 35, 7, 7),
('REF018', 'Nest Cam IQ', 'Caméra de surveillance connectée', 299.99, 70, 8, 8),
('REF019', 'Apple Pencil Protector', 'Protection écran tablette', 19.99, 150, 9, 9),
('REF020', 'Corsair Vengeance DDR5', 'Mémoire RAM gaming', 229.99, 60, 10, 10);

-- Insertion des clients
INSERT INTO Customers (first_name, last_name, email, phone) VALUES
('Paul', 'Martin', 'paul@email.com', '0611111111'),
('Sophie', 'Bernard', 'sophie@email.com', '0622222222'),
('Lucas', 'Petit', 'lucas@email.com', '0633333333'),
('Emma', 'Robert', 'emma@email.com', '0644444444'),
('Thomas', 'Richard', 'thomas@email.com', '0655555555'),
('Julie', 'Dubois', 'julie@email.com', '0666666666'),
('Antoine', 'Moreau', 'antoine@email.com', '0677777777'),
('Céline', 'Lambert', 'celine@email.com', '0688888888'),
('Nicolas', 'Girard', 'nicolas@email.com', '0699999999'),
('Marie', 'Leroy', 'marie@email.com', '0610101010'),
('David', 'Roux', 'david@email.com', '0620202020'),
('Laura', 'Vincent', 'laura@email.com', '0630303030'),
('Pierre', 'Fournier', 'pierre@email.com', '0640404040'),
('Sarah', 'Andre', 'sarah@email.com', '0650505050'),
('Hugo', 'Mercier', 'hugo@email.com', '0660606060');

-- Insertion des commandes
INSERT INTO Orders (customer_id, total_amount) VALUES
(1, 1299.98),
(2, 799.99),
(3, 289.98),
(4, 199.99),
(5, 39.98),
(6, 699.99),
(7, 449.98),
(8, 899.99),
(9, 159.99),
(10, 1499.98),
(11, 249.98),
(12, 599.99),
(13, 129.99),
(14, 399.99),
(15, 179.98),
(1, 499.99),
(2, 299.99),
(3, 899.99),
(4, 149.99),
(5, 1299.98);

-- Insertion des lignes de commande
INSERT INTO Order_Lines (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 999.99),
(1, 11, 1, 89.99),
(2, 2, 1, 799.99),
(3, 11, 2, 89.99),
(3, 12, 1, 29.99),
(4, 3, 1, 199.99),
(5, 12, 2, 29.99),
(6, 9, 1, 699.99),
(7, 14, 2, 69.99),
(8, 7, 1, 899.99),
(9, 5, 1, 159.99),
(10, 6, 1, 1299.99),
(10, 16, 1, 599.99),
(11, 13, 1, 149.99),
(11, 12, 1, 29.99),
(12, 16, 1, 599.99),
(13, 18, 1, 129.99),
(14, 10, 1, 399.99),
(15, 15, 1, 199.99),
(16, 4, 1, 499.99),
(17, 17, 1, 299.99),
(18, 7, 1, 899.99),
(19, 8, 1, 149.99),
(20, 1, 1, 999.99),
(20, 11, 1, 89.99),
(1, 3, 2, 199.99),
(2, 5, 1, 159.99),
(3, 7, 1, 899.99),
(4, 9, 1, 699.99),
(5, 11, 3, 89.99);