import db from "../utils/db";
import { generateJWT } from "../utils/jwt";
import { generateSalt, hashPassword, verifyPassword } from "../utils/password";

export const signup = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = await findUserByEmail(email);

  if (userExists) {
    return res.status(409).json({ message: "Email already taken" });
  }

  const salt = await generateSalt();
  const hashedPassword = await hashPassword(password, salt);
  const user = await createUser(
    email,
    hashedPassword,
    firstName,
    lastName,
    salt
  );

  const token = generateJWT(user);

  return res.status(201).json({ message: "Sign up successful!", user, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(400).json({ message: "Invalid login credentials" });
  }

  const isMatch = await verifyPassword(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid login credentials" });
  }

  const token = generateJWT(user);

  return res.status(201).json({ message: "Log in successful!", user, token });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM Users WHERE email='${email}'`, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const createUser = (email, password, firstName, lastName, salt) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Users (email, password, firstName, lastName, salt) VALUES ("${email}", "${password}", "${
        firstName || ""
      }", "${lastName || ""}", "${salt}")`,
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            email,
            password,
            firstName,
            lastName,
            salt,
          });
        }
      }
    );
  });
};
