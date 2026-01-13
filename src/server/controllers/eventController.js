const pool = require('../database');

const eventController = {
  getAllEvents: async (req, res) => {
    try {
      const [events] = await pool.query(`
       SELECT 
          e.EventID, 
          e.Title, 
          e.Description, 
          e.Location, 
          e.StartDateTime,
          e.EndDateTime,
          e.Image,
          c.company_name AS CompanyName,
          c.logo_path   AS CompanyLogo
        FROM events e
        LEFT JOIN companies c ON e.company_id = c.id
        ORDER BY e.StartDateTime ASC
      `);

      console.log('Successfully fetched events:', events.length);
      res.json(events);
    } catch (error) {
      console.error('Error in simplified events query:', error);
      res.status(500).json({ 
        error: 'Failed to fetch events',
        details: error.message 
      });
    }
  },

  getPopularEvents: async (req, res) => {
    try {
      const [events] = await pool.query(`
        SELECT 
          e.EventID, 
          e.Title, 
          e.Description, 
          e.Location, 
          e.StartDateTime,
          e.EndDateTime,
          e.Image,
          c.company_name AS CompanyName,
          c.logo_path   AS CompanyLogo,
          COUNT(r.RegistrationID) AS popularity
        FROM events e
        LEFT JOIN registrations r ON e.EventID = r.EventID
        LEFT JOIN companies c ON e.company_id = c.id
        GROUP BY e.EventID
        HAVING popularity >= 5
        ORDER BY popularity DESC
        LIMIT 6
      `);

      res.json(events);
    } catch (error) {
      console.error('Error fetching popular events:', error);
      res.status(500).json({ 
        error: 'Failed to fetch popular events',
        details: error.message 
      });
    }
  },

getEventById: async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.EventID, 
        e.Title, 
        e.Description, 
        e.Location, 
        e.StartDateTime,
        e.EndDateTime,
        e.Image,
        c.company_name AS CompanyName,
        c.logo_path   AS CompanyLogo
      FROM events e
      LEFT JOIN companies c ON e.company_id = c.id
      WHERE e.EventID = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ 
      error: 'Failed to fetch event',
      details: error.message 
    });
  }
},

};

module.exports = eventController;
