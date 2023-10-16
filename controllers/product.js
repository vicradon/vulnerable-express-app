import db from "../utils/db";

// Create a Product (admin level)
export async function createProduct(req, res, next) {
  const { name, description } = req.body;

  const insertProductQuery =
    "INSERT INTO Products (name, description) VALUES (?, ?)";

  db.run(insertProductQuery, [name, description], function (err) {
    if (err) {
      return next(err);
    }

    const product = {
      id: this.lastID,
      name,
      description,
    };

    return res.status(201).json({
      message: "Created product successfully",
      product,
    });
  });
}

// Fetch All Products (all users)
export async function fetchAllProducts(req, res, next) {
  const query = "SELECT * FROM Products";

  db.all(query, (err, products) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      message: "Fetched products successfully",
      products,
    });
  });
}

// Update a Product (admin level)
export async function updateProduct(req, res, next) {
  const { productId, name, description } = req.body;

  const updateProductQuery =
    "UPDATE Products SET name = ?, description = ? WHERE id = ?";

  db.run(updateProductQuery, [name, description, productId], function (err) {
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      message: "Updated product successfully",
      product: { id: productId, name, description },
    });
  });
}

// Delete a Product (admin level)
export async function deleteProduct(req, res, next) {
  const productId = req.params.productId; // Assuming productId is a request parameter

  const deleteProductQuery = "DELETE FROM Products WHERE id = ?";

  db.run(deleteProductQuery, [productId], function (err) {
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      message: "Deleted product successfully",
    });
  });
}
