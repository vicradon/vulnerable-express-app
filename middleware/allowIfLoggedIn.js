import jwt from "jsonwebtoken";
import db from "../utils/db";

export default async function allowIfLoggedIn(req, res, next) {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.slice(7);
    }

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
          return res.status(403).json({
            error: "You have been logged out. Login again to access this route",
          });
        }

        const userId = user.user.id; // Assuming user contains the user ID

        // Replace this part with an SQL query to retrieve user details by ID
        const query = "SELECT * FROM Users WHERE id = ?";

        db.get(query, [userId], (err, userRow) => {
          if (err) {
            return next(err);
          }

          if (userRow) {
            req.user = userRow;
            next();
          } else {
            return res.status(403).json({
              error: "User not found",
            });
          }
        });
      });
    } else {
      return res.status(401).json({
        error: "No token supplied",
      });
    }
  } catch (error) {
    next(error);
  }
}
