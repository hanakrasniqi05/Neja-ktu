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

async function getCompanyId(connection, userId) {
  const [rows] = await connection.query(
    "SELECT id FROM companies WHERE user_id = ?",
    [userId]
  );
  return rows.length ? rows[0].id : null;
}


// CREATE EVENT - FIXED VERSION
exports.createEvent = async (req, res) => {
  let connection;
  try {
    const {
      title,
      description,
      location,
      startDateTime,
      endDateTime,
      category,
      rsvpLimit
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    connection = await db.getConnection();

    const companyId = await getCompanyId(connection, req.user.UserId);
    if (!companyId) {
      return res.status(403).json({ error: "Only companies can create events" });
    }

    await connection.beginTransaction();

    const [eventResult] = await connection.query(
      `INSERT INTO events
       (company_id, Title, Description, Location, StartDateTime, EndDateTime, RsvpLimit, Image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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

    if (category) {
      let categoryId;
      const [existing] = await connection.query(
        "SELECT CategoryID FROM categories WHERE Name = ?",
        [category]
      );

      if (existing.length) {
        categoryId = existing[0].CategoryID;
      } else {
        const [catRes] = await connection.query(
          "INSERT INTO categories (Name) VALUES (?)",
          [category]
        );
        categoryId = catRes.insertId;
      }

      await connection.query(
        "INSERT INTO event_categories (EventID, CategoryID) VALUES (?, ?)",
        [eventId, categoryId]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Event created", EventID: eventId });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Create event error:", err);
    res.status(500).json({ error: "Error creating event" });
  } finally {
    if (connection) connection.release();
  }
};


// GET EVENTS BY COMPANY - FIXED VERSION
exports.getEventsByCompany = async (req, res) => {
  try {
    const [[company]] = await db.query(
      "SELECT id FROM companies WHERE user_id = ?",
      [req.user.UserId]
    );

    if (!company) return res.json([]);

    const [events] = await db.query(
      `SELECT e.*, GROUP_CONCAT(c.Name) AS categories
       FROM events e
       LEFT JOIN event_categories ec ON e.EventID = ec.EventID
       LEFT JOIN categories c ON ec.CategoryID = c.CategoryID
       WHERE e.company_id = ?
       GROUP BY e.EventID
       ORDER BY e.StartDateTime DESC`,
      [company.id]
    );

    events.forEach(e => e.Image = makeImageUrl(req, e.Image));
    normalizeDates(events);
    res.json(events);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching company events" });
  }
};

// UPDATE EVENT - FIXED VERSION
exports.updateEvent = async (req, res) => {
  let connection;
  try {
    const {
      title,
      description,
      location,
      startDateTime,
      endDateTime,
      category,
      rsvpLimit
    } = req.body;

    const eventId = req.params.id;
    const newImage = req.file ? `/uploads/${req.file.filename}` : null;

    connection = await db.getConnection();
    const companyId = await getCompanyId(connection, req.user.UserId);
    if (!companyId) return res.status(403).json({ error: "Unauthorized" });

    const [events] = await connection.query(
      "SELECT * FROM events WHERE EventID = ?",
      [eventId]
    );

    if (!events.length) return res.status(404).json({ error: "Event not found" });
    if (events[0].company_id !== companyId)
      return res.status(403).json({ error: "Not authorized" });

    await connection.beginTransaction();

    let sql =
      "UPDATE events SET Title=?, Description=?, Location=?, StartDateTime=?, EndDateTime=?, RsvpLimit=?";
    const params = [
      title,
      description,
      location,
      startDateTime,
      endDateTime,
      rsvpLimit
    ];

    if (newImage) {
      sql += ", Image=?";
      params.push(newImage);

      if (events[0].Image) {
        fs.unlink(
          path.join(uploadFolder, path.basename(events[0].Image)),
          () => {}
        );
      }
    }

    sql += " WHERE EventID=?";
    params.push(eventId);

    await connection.query(sql, params);

    if (category) {
      await connection.query(
        "DELETE FROM event_categories WHERE EventID = ?",
        [eventId]
      );

      let categoryId;
      const [existing] = await connection.query(
        "SELECT CategoryID FROM categories WHERE Name = ?",
        [category]
      );

      if (existing.length) {
        categoryId = existing[0].CategoryID;
      } else {
        const [catRes] = await connection.query(
          "INSERT INTO categories (Name) VALUES (?)",
          [category]
        );
        categoryId = catRes.insertId;
      }

      await connection.query(
        "INSERT INTO event_categories (EventID, CategoryID) VALUES (?, ?)",
        [eventId, categoryId]
      );
    }

    await connection.commit();
    res.json({ message: "Event updated" });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Error updating event" });
  } finally {
    if (connection) connection.release();
  }
};

// DELETE EVENT - FIXED VERSION
exports.deleteEvent = async (req, res) => {
  let connection;
  try {
    const eventId = req.params.id;

    connection = await db.getConnection();
    const companyId = await getCompanyId(connection, req.user.UserId);
    if (!companyId) return res.status(403).json({ error: "Unauthorized" });

    const [events] = await connection.query(
      "SELECT * FROM events WHERE EventID = ?",
      [eventId]
    );

    if (!events.length) return res.status(404).json({ error: "Event not found" });
    if (events[0].company_id !== companyId)
      return res.status(403).json({ error: "Not authorized" });

    await connection.beginTransaction();

    await connection.query(
      "DELETE FROM event_categories WHERE EventID = ?",
      [eventId]
    );

    await connection.query(
      "DELETE FROM events WHERE EventID = ?",
      [eventId]
    );

    await connection.commit();

    if (events[0].Image) {
      fs.unlink(
        path.join(uploadFolder, path.basename(events[0].Image)),
        () => {}
      );
    }

    res.json({ message: "Event deleted" });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Error deleting event" });
  } finally {
    if (connection) connection.release();
  }
};