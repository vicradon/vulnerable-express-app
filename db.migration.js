import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("database.db");

db.serialize(() => {
  // Create the Users table
  db.run(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    isAdmin BOOLEAN DEFAULT 0,
    firstName TEXT,
    lastName TEXT,
    salt TEXT
  )`);

  // Create the Products table
  db.run(`CREATE TABLE IF NOT EXISTS Products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
  )`);

  // Create the Orders table
  db.run(`CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quantity INTEGER,
    productId INTEGER,
    userId INTEGER,
    FOREIGN KEY (productId) REFERENCES Products(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
  )`);

  console.log("Tables created successfully.");
});

db.close();
