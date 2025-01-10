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
