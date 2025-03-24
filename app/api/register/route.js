import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password, userRole } = req.body;

    // Validate the input
    if (!firstName || !lastName || !email || !password || !userRole) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a 24-character random UUID without dashes
      const userId = uuidv4().replace(/-/g, '').slice(0, 24);

      // Save the user to your MySQL database (assumes you have a database setup)
      // Example SQL query to save user (use your actual DB client)
      const db = await getDbConnection(); // Replace with your DB connection method

      const result = await db.query(
        'INSERT INTO users (id, first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, firstName, lastName, email, hashedPassword, userRole]
      );

      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function getDbConnection() {
  // Set up your MySQL connection (using MySQL2 or another client)
  const mysql = require('mysql2');
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database',
  });
  return connection.promise(); // Return promise for async queries
}
