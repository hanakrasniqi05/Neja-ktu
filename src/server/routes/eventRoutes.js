const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/popular', async (req, res) => {
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
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;