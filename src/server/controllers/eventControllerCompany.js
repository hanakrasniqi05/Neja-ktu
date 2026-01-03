const db = require("../database");
const fs = require("fs");
const path = require("path");

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

// CREATE EVENT - FIXED VERSION
exports.createEvent = async (req, res) => {
  let connection;
  try {
    const { title, description, location, startDateTime, endDateTime, category, rsvpLimit } = req.body;
    const companyId = req.user.UserId || req.user.id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // 1. First, insert the event (without Category column)
      const [eventResult] = await connection.query(
        `INSERT INTO events 
          (CompanyID, company_id, Title, Description, Location, StartDateTime, EndDateTime, RsvpLimit, Image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          companyId, 
          companyId, 
          title, 
          description, 
          location, 
          startDateTime, 
          endDateTime, 
          rsvpLimit || null, 
          imagePath
        ]
      );

      const eventId = eventResult.insertId;

      // 2. Handle category through many-to-many relationship
      if (category) {
        // Check if category exists
        const [existingCategories] = await connection.query(
          'SELECT CategoryID FROM categories WHERE Name = ?',
          [category]
        );

        let categoryId;

        if (existingCategories.length > 0) {
          categoryId = existingCategories[0].CategoryID;
        } else {
          // Create new category
          const [categoryResult] = await connection.query(
            'INSERT INTO categories (Name) VALUES (?)',
            [category]
          );
          categoryId = categoryResult.insertId;
        }

        // Link event to category
        await connection.query(
          'INSERT INTO event_categories (EventID, CategoryID) VALUES (?, ?)',
          [eventId, categoryId]
        );
      }

      await connection.commit();

      // Get the created event with categories
      const [events] = await connection.query(
        `SELECT e.*, GROUP_CONCAT(c.Name) as categories
         FROM events e
         LEFT JOIN event_categories ec ON e.EventID = ec.EventID
         LEFT JOIN categories c ON ec.CategoryID = c.CategoryID
         WHERE e.EventID = ?
         GROUP BY e.EventID`,
        [eventId]
      );

      if (events.length === 0) {
        return res.status(404).json({ error: "Event not found after creation" });
      }

      const event = events[0];
      event.Image = makeImageUrl(req, event.Image);
      normalizeDates(event);

      res.status(201).json(event);

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ 
      error: "Error creating event",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
};

// GET EVENTS BY COMPANY - FIXED VERSION
exports.getEventsByCompany = async (req, res) => {
  try {
    const companyId = req.user.UserId || req.user.id;

    const [results] = await db.query(
      `SELECT e.*, GROUP_CONCAT(c.Name) as categories
       FROM events e
       LEFT JOIN event_categories ec ON e.EventID = ec.EventID
       LEFT JOIN categories c ON ec.CategoryID = c.CategoryID
       WHERE e.CompanyID = ?
       GROUP BY e.EventID
       ORDER BY e.StartDateTime DESC`,
      [companyId]
    );

    results.forEach(r => {
      r.Image = makeImageUrl(req, r.Image);
    });
    normalizeDates(results);
    
    res.json(results);

  } catch (error) {
    console.error("Error fetching company events:", error);
    res.status(500).json({ 
      error: "Error fetching events",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// UPDATE EVENT - FIXED VERSION
exports.updateEvent = async (req, res) => {
  let connection;
  try {
    const { title, description, location, startDateTime, endDateTime, category, rsvpLimit } = req.body;
    const eventId = req.params.id;
    const newImage = req.file ? `/uploads/${req.file.filename}` : null;
    const companyId = req.user.UserId || req.user.id;

    connection = await db.getConnection();

    // Check if event exists and belongs to company
    const [existingEvents] = await connection.query(
      "SELECT * FROM events WHERE EventID = ?", 
      [eventId]
    );

    if (existingEvents.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const existing = existingEvents[0];
    if (existing.CompanyID !== companyId) {
      return res.status(403).json({ error: "Not authorized to update this event" });
    }

    await connection.beginTransaction();

    try {
      // Update event basic info
      const params = [title, description, location, startDateTime, endDateTime, rsvpLimit];
      let sql = "UPDATE events SET Title=?, Description=?, Location=?, StartDateTime=?, EndDateTime=?, RsvpLimit=?";

      if (newImage) {
        sql += ", Image=?";
        params.push(newImage);
        
        // Delete old image if exists
        if (existing.Image) {
          const oldPath = path.join(uploadFolder, path.basename(existing.Image));
          fs.unlink(oldPath, err => {
            if (err && err.code !== "ENOENT") console.error("Error deleting old image:", err);
          });
        }
      }

      sql += " WHERE EventID=?";
      params.push(eventId);

      await connection.query(sql, params);

      // Update category if provided
      if (category) {
        // Remove existing categories
        await connection.query(
          'DELETE FROM event_categories WHERE EventID = ?',
          [eventId]
        );

        // Find or create category
        const [existingCategories] = await connection.query(
          'SELECT CategoryID FROM categories WHERE Name = ?',
          [category]
        );

        let categoryId;
        if (existingCategories.length > 0) {
          categoryId = existingCategories[0].CategoryID;
        } else {
          const [categoryResult] = await connection.query(
            'INSERT INTO categories (Name) VALUES (?)',
            [category]
          );
          categoryId = categoryResult.insertId;
        }

        // Add new category
        await connection.query(
          'INSERT INTO event_categories (EventID, CategoryID) VALUES (?, ?)',
          [eventId, categoryId]
        );
      }

      await connection.commit();

      // Get updated event with categories
      const [updatedEvents] = await connection.query(
        `SELECT e.*, GROUP_CONCAT(c.Name) as categories
         FROM events e
         LEFT JOIN event_categories ec ON e.EventID = ec.EventID
         LEFT JOIN categories c ON ec.CategoryID = c.CategoryID
         WHERE e.EventID = ?
         GROUP BY e.EventID`,
        [eventId]
      );

      const ev = updatedEvents[0];
      ev.Image = makeImageUrl(req, ev.Image);
      normalizeDates(ev);
      
      res.json(ev);

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ 
      error: "Error updating event",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
};

// DELETE EVENT - FIXED VERSION
exports.deleteEvent = async (req, res) => {
  let connection;
  try {
    const eventId = req.params.id;
    const companyId = req.user.UserId || req.user.id;

    connection = await db.getConnection();

    // Check if event exists and belongs to company
    const [existingEvents] = await connection.query(
      "SELECT * FROM events WHERE EventID = ?", 
      [eventId]
    );

    if (existingEvents.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const existing = existingEvents[0];
    if (existing.CompanyID !== companyId) {
      return res.status(403).json({ error: "Not authorized to delete this event" });
    }

    await connection.beginTransaction();

    try {
      // Delete from event_categories first
      await connection.query(
        'DELETE FROM event_categories WHERE EventID = ?',
        [eventId]
      );

      // Delete the event
      await connection.query(
        'DELETE FROM events WHERE EventID = ?',
        [eventId]
      );

      await connection.commit();

      // Delete image file
      if (existing.Image) {
        const oldPath = path.join(uploadFolder, path.basename(existing.Image));
        fs.unlink(oldPath, unlinkErr => {
          if (unlinkErr && unlinkErr.code !== "ENOENT") {
            console.error("Error deleting image on event delete:", unlinkErr);
          }
        });
      }

      res.json({ message: "Event deleted successfully" });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ 
      error: "Error deleting event",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
};