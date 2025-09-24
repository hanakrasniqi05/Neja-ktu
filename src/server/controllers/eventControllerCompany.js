const db = require("../database");
const fs = require("fs");
const path = require("path");

// Helper: bëj path absolut për image nëse ekziston
function makeImageUrl(req, imagePath) {
  if (!imagePath) return null;
  // Në DB ruajmë path si '/uploads/filename.ext'
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

// Create Event
exports.createEvent = (req, res) => {
  const { title, description, location, startDateTime, endDateTime } = req.body;
  const companyId = req.user.id; 
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO events (CompanyID, Title, Description, Location, StartDateTime, EndDateTime, Image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [companyId, title, description, location, startDateTime, endDateTime, image], (err, result) => {
    if (err) return res.status(500).json({ error: err.message || err });

    db.query("SELECT * FROM events WHERE EventID = ?", [result.insertId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message || err2 });
      if (rows.length === 0) return res.status(404).json({ error: "Event not found" });

      const ev = rows[0];
      ev.Image = makeImageUrl(req, ev.Image);
      normalizeDates(ev);
      res.status(201).json(ev);
    });
  });
};

// Get Events
exports.getEventsByCompany = (req, res) => {
  const companyId = req.user.id;
  const sql = "SELECT * FROM events WHERE CompanyID = ? ORDER BY StartDateTime DESC";
  db.query(sql, [companyId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || err });

    // convert image paths to absolute urls and normalize dates
    results.forEach(r => {
      r.Image = makeImageUrl(req, r.Image);
    });
    normalizeDates(results);
    res.json(results);
  });
};

// Update Event 
exports.updateEvent = (req, res) => {
  const { title, description, location, startDateTime, endDateTime } = req.body;
  const eventId = req.params.id;
  const newImage = req.file ? `/uploads/${req.file.filename}` : null;
  const companyId = req.user.id;

  db.query("SELECT * FROM events WHERE EventID = ?", [eventId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message || err });
    if (rows.length === 0) return res.status(404).json({ error: "Event not found" });

    const existing = rows[0];

    if (existing.CompanyID !== companyId) {
      return res.status(403).json({ error: "Not authorized to update this event" });
    }

    let sql = "UPDATE events SET Title=?, Description=?, Location=?, StartDateTime=?, EndDateTime=?";
    const params = [title, description, location, startDateTime, endDateTime];

    if (newImage) {
      sql += ", Image=?";
      params.push(newImage);
    }
    sql += " WHERE EventID=?";
    params.push(eventId);

    db.query(sql, params, (err2) => {
      if (err2) return res.status(500).json({ error: err2.message || err2 });

      if (newImage && existing.Image) {
        const oldPath = path.join(__dirname, "..", existing.Image); 
        fs.unlink(oldPath, unlinkErr => {

          if (unlinkErr && unlinkErr.code !== "ENOENT") {
            console.error("Error deleting old image:", unlinkErr);
          }
        });
      }

      db.query("SELECT * FROM events WHERE EventID = ?", [eventId], (err3, rowsUpdated) => {
        if (err3) return res.status(500).json({ error: err3.message || err3 });
        const ev = rowsUpdated[0];
        ev.Image = makeImageUrl(req, ev.Image);
        normalizeDates(ev);
        res.json(ev);
      });
    });
  });
};

//  Delete Event 
exports.deleteEvent = (req, res) => {
  const eventId = req.params.id;
  const companyId = req.user.id;

  db.query("SELECT * FROM events WHERE EventID = ?", [eventId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message || err });
    if (rows.length === 0) return res.status(404).json({ error: "Event not found" });

    const existing = rows[0];
    if (existing.CompanyID !== companyId) {
      return res.status(403).json({ error: "Not authorized to delete this event" });
    }

    db.query("DELETE FROM events WHERE EventID = ?", [eventId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message || err2 });

      if (existing.Image) {
        const oldPath = path.join(__dirname, "..", existing.Image);
        fs.unlink(oldPath, unlinkErr => {
          if (unlinkErr && unlinkErr.code !== "ENOENT") {
            console.error("Error deleting image on event delete:", unlinkErr);
          }
        });
      }

      res.json({ message: "Event deleted successfully" });
    });
  });
};
