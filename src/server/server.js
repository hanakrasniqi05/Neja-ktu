require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const fs = require("fs");

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const commentRoutes = require('./routes/commentRoutes'); 
const eventCategoryRoutes = require('./routes/eventCategoryRoutes');
const companyRoutes = require('./routes/companyRoutes');
const authRoutes = require('./routes/authRoutes');
const pool = require('./database');
const adminRoutes = require('./routes/adminRoutes');
const rsvpRoutes = require ('./routes/rsvpRoutes');
const companyEventRoutes = require("./routes/companyEventRoutes");

const app = express();

// Kontrolli i folderit 'uploads'
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Folder 'uploads' u krijua automatikisht.");
}

// Middleware për të lexuar JSON në body
app.use(cors());
app.use(express.json());

// Lejon qasje në imazhet e ngarkuara
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Testim lidhje me DB
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
})();

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to the API',
    endpoints: {
      users: '/api/users',
      events: '/api/events',
      comments: '/api/comments',
      eventCategories: '/api/event-categories',
      companies: '/api/companies',
      companyEvents: '/api/company-events',
      auth: '/api/auth'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/comments', commentRoutes); 
app.use('/api/event-categories', eventCategoryRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rsvps', rsvpRoutes)
app.use("/api/company-events", companyEventRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
