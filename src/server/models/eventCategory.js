const db = require('../database.js');

class EventCategory {
  static async getAllCategories() {
    const [rows] = await db.query('SELECT * FROM categories');
    return rows;
  }

  static async getEventsByCategory(categoryId) {
    const [rows] = await db.query(`
      SELECT e.*, GROUP_CONCAT(c.Name) as categories 
      FROM events e
      JOIN event_categories ec ON e.EventID = ec.EventID
      JOIN categories c ON ec.CategoryID = c.CategoryID
      WHERE c.CategoryID = ?
      GROUP BY e.EventID
    `, [categoryId]);
    return rows;
  }

  static async getAllEvents() {
    const [rows] = await db.query(`
      SELECT e.*, GROUP_CONCAT(c.Name) as categories 
      FROM events e
      LEFT JOIN event_categories ec ON e.EventID = ec.EventID
      LEFT JOIN categories c ON ec.CategoryID = c.CategoryID
      GROUP BY e.EventID
    `);
    return rows;
  }
}

module.exports = EventCategory;