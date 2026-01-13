const db = require('../database.js');

class EventCategory {
  static async getAllCategories() {
    const [rows] = await db.query('SELECT * FROM categories');
    return rows;
  }

static async getEventsByCategories(categoryIds) {
  const placeholders = categoryIds.map(() => '?').join(',');

  const [rows] = await db.query(`
    SELECT 
      e.*,
      COALESCE(cmp.company_name, CONCAT(u.FirstName, ' ', u.LastName)) AS CompanyName,
      COALESCE(cmp.logo_path, u.ProfilePicture) AS CompanyLogo,
      (
        SELECT GROUP_CONCAT(DISTINCT cat.Name ORDER BY cat.Name)
        FROM event_categories ec
        JOIN categories cat ON ec.CategoryID = cat.CategoryID
        WHERE ec.EventID = e.EventID
      ) AS categories
    FROM events e
    LEFT JOIN companies cmp ON e.company_id = cmp.id
    LEFT JOIN user u ON e.company_id = u.UserId
    WHERE e.EventID IN (
      SELECT DISTINCT EventID
      FROM event_categories
      WHERE CategoryID IN (${placeholders})
    )
    ORDER BY e.StartDateTime ASC
  `, categoryIds);

  return rows;
}


static async getAllEvents() {
  const [rows] = await db.query(`
    SELECT 
      e.*,
      COALESCE(cmp.company_name, CONCAT(u.FirstName, ' ', u.LastName)) AS CompanyName,
      COALESCE(cmp.logo_path, u.ProfilePicture) AS CompanyLogo,
      (
        SELECT GROUP_CONCAT(DISTINCT cat.Name ORDER BY cat.Name)
        FROM event_categories ec
        JOIN categories cat ON ec.CategoryID = cat.CategoryID
        WHERE ec.EventID = e.EventID
      ) AS categories
    FROM events e
    LEFT JOIN companies cmp ON e.company_id = cmp.id
    LEFT JOIN user u ON e.company_id = u.UserId
    ORDER BY e.StartDateTime ASC
  `);

  return rows;
}


}

module.exports = EventCategory;