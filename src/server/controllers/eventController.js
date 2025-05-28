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
          u.ProfilePicture AS companyLogo
        FROM events e
        LEFT JOIN user u ON e.CompanyID = u.UserId
        WHERE e.EndDateTime > NOW()
        ORDER BY e.StartDateTime ASC
      `);

      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
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
          COUNT(r.RegistrationID) AS popularity,
          u.ProfilePicture AS companyLogo
        FROM events e
        LEFT JOIN registrations r ON e.EventID = r.EventID
        LEFT JOIN user u ON e.CompanyID = u.UserId
        WHERE e.EndDateTime > NOW()
        GROUP BY e.EventID
        ORDER BY popularity DESC
        LIMIT 6
      `);

      res.json(events);
    } catch (error) {
      console.error('Error fetching popular events:', error);
      res.status(500).json({ error: 'Failed to fetch popular events' });
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
          u.ProfilePicture AS companyLogo
        FROM events e
        LEFT JOIN user u ON e.CompanyID = u.UserId
        WHERE e.EventID = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  },

};

module.exports = eventController;
