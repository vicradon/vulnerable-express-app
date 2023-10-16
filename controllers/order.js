import db from "../utils/db";

// Fetch Orders for a User
export async function fetchOrders(req, res, next) {
  const userId = req.params.userId; // Assuming userId is a request parameter
  const query = "SELECT * FROM Orders WHERE userId = ?";

  db.all(query, [userId], (err, orders) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      message: "Fetched orders successfully",
      orders,
    });
  });
}

// Create an Order for a User
export async function createOrder(req, res, next) {
  try {
    const { productId, userId, quantity } = req.body;

    const productQuery = "SELECT * FROM Products WHERE id = ?";
    const userQuery = "SELECT * FROM Users WHERE id = ?";

    db.get(productQuery, [productId], (productErr, product) => {
      if (productErr) {
        return next(productErr);
      }

      db.get(userQuery, [userId], (userErr, user) => {
        if (userErr) {
          return next(userErr);
        }

        if (!product) {
          return next(new Error("Product does not exist"));
        }

        if (!user) {
          return next(new Error("User not found"));
        }

        const insertOrderQuery =
          "INSERT INTO Orders (quantity, productId, userId) VALUES (?, ?, ?)";

        db.run(
          insertOrderQuery,
          [quantity, productId, userId],
          function (insertErr) {
            if (insertErr) {
              return next(insertErr);
            }

            return res.status(200).json({
              message: "Created order successfully",
              order: { id: this.lastID, quantity, productId, userId },
            });
          }
        );
      });
    });
  } catch (error) {
    next(error);
  }
}
