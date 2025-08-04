const mysql = require('mysql2/promise');
require('dotenv').config();

// Debug: Print database configuration to verify environment variables are loaded
console.log("DB Config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '******' : null, // Hide actual password for security
  database: process.env.DB_NAME
});

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST,       
  user: process.env.DB_USER,       
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,   
  waitForConnections: true,        
  connectionLimit: 10,              
  queueLimit: 0                   
});

// Immediately test database connection when this module is loaded
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL database connected successfully!");
    conn.release(); // Release connection back to pool
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
})();

// Export the pool for use in other modules
module.exports = pool;
