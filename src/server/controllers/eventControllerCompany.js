const pool = require('../database.js');
const fs = require("fs");
const path = require("path");

// Helper function to validate MySQL DATETIME format and year range
function validateMySQLDateTime(dateTimeStr) {
  if (!dateTimeStr) return false;
  
  // Check format: YYYY-MM-DD HH:mm:ss
  const mysqlRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  if (!mysqlRegex.test(dateTimeStr)) {
    return false;
  }
  
  const match = dateTimeStr.match(mysqlRegex);
  const year = parseInt(match[1], 10);
  
  if (year < 1000 || year > 9999) {
    return false;
  }
  
  // Additional date validation
  const date = new Date(dateTimeStr.replace(' ', 'T') + 'Z');
  return !isNaN(date.getTime());
}

// Folderi ku multer ruan skedarët
const uploadFolder = path.join(__dirname, "..", "..", "uploads");

// Helper: bëj URL absolute për frontend
function makeImageUrl(req, imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${req.protocol}://${req.get("host")}${imagePath}`;
}

// Convert date fields to ISO strings
function normalizeDates(rows) {
  if (!rows) return rows;
  const arr = Array.isArray(rows) ? rows : [rows];
  arr.forEach(r => {
    if (r.StartDateTime) r.StartDateTime = new Date(r.StartDateTime).toISOString();
    if (r.EndDateTime) r.EndDateTime = new Date(r.EndDateTime).toISOString();
  });
  return rows;
}

async function getCompanyId(connection, userId) {
  const [rows] = await connection.query(
    "SELECT id FROM companies WHERE user_id = ?",
    [userId]
  );
  return rows.length ? rows[0].id : null;
}

const createEvent = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('User:', req.user);

    const { 
      title, 
      description, 
      location, 
      startDateTime, 
      endDateTime, 
      rsvpLimit,
      category 
    } = req.body;
    
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Basic validation
    if (!title || !description || !location || !startDateTime || !endDateTime) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, location, start date and end date are required' 
      });
    }

    // Validate date formats and year range
    if (!validateMySQLDateTime(startDateTime) || !validateMySQLDateTime(endDateTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Year must be between 1000 and 9999.",
      });
    }

    // Ensure end date is after start date
    const startDate = new Date(startDateTime.replace(' ', 'T'));
    const endDate = new Date(endDateTime.replace(' ', 'T'));
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date.",
      });
    }

    // Find the company based on user_id
    const [companyRows] = await pool.query(
      'SELECT id FROM companies WHERE user_id = ?',
      [req.user.id]
    );

    console.log('Company rows found:', companyRows);

    if (companyRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company profile not found. Please complete company registration first.' 
      });
    }

    const companyId = companyRows[0].id;
    console.log('Company ID:', companyId);

    // Create the event
    const [result] = await pool.query(
      `INSERT INTO events 
       (Title, Description, Location, StartDateTime, EndDateTime, RsvpLimit, Image, company_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description, 
        location, 
        startDateTime, 
        endDateTime, 
        rsvpLimit || null, 
        imagePath,
        companyId]
    );

    const eventId = result.insertId;
    console.log('Event created with ID:', eventId);

    // If a category is provided, link it to the event
    if (category) {
      try {
        const [categoryRows] = await pool.query(
          'SELECT CategoryID FROM categories WHERE Name = ?',
          [category]
        );
        
        if (categoryRows.length > 0) {
          const categoryId = categoryRows[0].CategoryID;
          await pool.query(
            'INSERT INTO event_categories (EventID, CategoryID) VALUES (?, ?)',
            [eventId, categoryId]
          );
          console.log('Category linked:', category);
        }
      } catch (categoryError) {
        console.log('Category linking failed (non-critical):', categoryError.message);
      }
    }

    // Fetch the newly created event to return it to the client
    const [newEvent] = await pool.query(
      `SELECT e.*, 
              c.company_name as CompanyName,
              c.logo_path as CompanyLogo
       FROM events e
       LEFT JOIN companies c ON e.company_id = c.id
       WHERE e.EventID = ?`,
      [eventId]
    );

    res.status(201).json({ 
    success: true, 
    message: 'Event created successfully', 
    event: {
      ...newEvent[0],
    Image: imagePath ? `${req.protocol}://${req.get('host')}${imagePath}` : null
  }
});

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, 
             c.company_name as CompanyName,
             c.logo_path as CompanyLogo
      FROM events e
      LEFT JOIN companies c ON e.company_id = c.id
      ORDER BY e.StartDateTime DESC
    `);

    const eventsWithFullUrls = rows.map(event => ({
      ...event,
      Image: event.Image ? `${req.protocol}://${req.get('host')}${event.Image}` : null
    }));

    res.json(eventsWithFullUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

const getPopularEvents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, 
             COUNT(r.rsvp_id) as rsvp_count,
             c.company_name as CompanyName,
             c.logo_path as CompanyLogo
      FROM events e
      LEFT JOIN rsvp r ON e.EventID = r.event_id
      LEFT JOIN companies c ON e.company_id = c.id
      GROUP BY e.EventID
      ORDER BY rsvp_count DESC
      LIMIT 5
    `);

    const eventsWithFullUrls = rows.map(event => ({
      ...event,
      Image: event.Image ? `${req.protocol}://${req.get('host')}${event.Image}` : null
    }));
    res.json(eventsWithFullUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the company ID
    const [companyRows] = await pool.query(
      'SELECT id FROM companies WHERE user_id = ?',
      [userId]
    );

    if (companyRows.length === 0) {
      return res.json([]);
    }

    const companyId = companyRows[0].id;
    
    const [rows] = await pool.query(
      `SELECT e.*, 
              c.company_name as CompanyName,
              c.logo_path as CompanyLogo
       FROM events e
       LEFT JOIN companies c ON e.company_id = c.id
       WHERE e.company_id = ?
       ORDER BY e.StartDateTime DESC`,
      [companyId]
    );
    
    const eventsWithFullUrls = rows.map(event => ({
      ...event,
      Image: event.Image ? `${req.protocol}://${req.get('host')}${event.Image}` : null
    }));
    
    res.json(eventsWithFullUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    const { 
      title, 
      description, 
      location, 
      startDateTime, 
      endDateTime, 
      rsvpLimit,
      category 
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    console.log('Update request for event:', eventId);
    console.log('Update data:', req.body);

    // Find the event and check if it belongs to the logged-in company
    const [eventRows] = await pool.query(
      `SELECT e.*, c.user_id 
       FROM events e 
       JOIN companies c ON e.company_id = c.id 
       WHERE e.EventID = ? AND c.user_id = ?`,
      [eventId, userId]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found or you do not have permission to update it' 
      });
    }

    // Validation
    if (!title || !description || !location || !startDateTime || !endDateTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }

    // Validate date formats and year range
    if (!validateMySQLDateTime(startDateTime) || !validateMySQLDateTime(endDateTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Year must be between 1000 and 9999.",
      });
    }

    // Ensure end date is after start date
    const startDate = new Date(startDateTime.replace(' ', 'T'));
    const endDate = new Date(endDateTime.replace(' ', 'T'));
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date.",
      });
    }

    // Update the event
    await pool.query(
      `UPDATE events 
       SET Title = ?, Description = ?, Location = ?, 
           StartDateTime = ?, EndDateTime = ?, RsvpLimit = ?, Image = ?
       WHERE EventID = ?`,
      [title, description, location, startDateTime, endDateTime, rsvpLimit || null, imagePath || null, eventId]
    );

    // Update categories
    await pool.query('DELETE FROM event_categories WHERE EventID = ?', [eventId]);
    
    if (category) {
      const [categoryRows] = await pool.query(
        'SELECT CategoryID FROM categories WHERE Name = ?',
        [category]
      );
      
      if (categoryRows.length > 0) {
        const categoryId = categoryRows[0].CategoryID;
        await pool.query(
          'INSERT INTO event_categories (EventID, CategoryID) VALUES (?, ?)',
          [eventId, categoryId]
        );
      }
    }

    // Fetch the updated event
    const [updatedEvent] = await pool.query(
      `SELECT e.*, 
              c.company_name as CompanyName,
              c.logo_path as CompanyLogo
       FROM events e
       LEFT JOIN companies c ON e.company_id = c.id
       WHERE e.EventID = ?`,
      [eventId]
    );

    res.json({ 
    success: true, 
    message: 'Event updated successfully', 
    event: {
      ...updatedEvent[0],
    Image: imagePath ? `${req.protocol}://${req.get('host')}${imagePath}` : (updatedEvent[0].Image ? `${req.protocol}://${req.get('host')}${updatedEvent[0].Image}` : null)
  }
});

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    console.log('Delete request for event:', eventId);

    // Find the event and check if it belongs to the logged-in company
    const [eventRows] = await pool.query(
      `SELECT e.*, c.user_id 
       FROM events e 
       JOIN companies c ON e.company_id = c.id 
       WHERE e.EventID = ? AND c.user_id = ?`,
      [eventId, userId]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found or you do not have permission to delete it' 
      });
    }

    // Delete the event
    await pool.query('DELETE FROM events WHERE EventID = ?', [eventId]);

    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });

  } catch (error) {
    console.error('Delete event error:', error);
    
    // If there is a foreign key constraint error
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === '23000') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete event because it has related data (registrations, comments, etc.)' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

module.exports = { 
  createEvent, 
  getEvents, 
  getPopularEvents,
  getMyEvents,
  updateEvent,  
  deleteEvent   
};