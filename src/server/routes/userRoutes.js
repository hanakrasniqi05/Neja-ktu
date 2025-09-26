const pool = require('../database.js');
const express = require('express');
const router = express.Router();
const { updateMe } = require('../controllers/userController');
const { deleteMe } = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const {
  protect,
  adminOnly,
  requireRole,
  requireAnyRole
} = require('../middleware/authMiddleware');

const uploadPath = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// PUT route for updating user
router.put('/me', protect, upload.single('profilePic'), updateMe);

// Import middleware funksionet me CommonJS

// Import controller-at me CommonJS
const {
  register,
  login,
  getMe,
  getAllUsers 
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Apply JWT token protection for all routes below
router.use(protect);

// Protected route për përdoruesin aktual
router.get('/me', getMe);

router.delete('/me', protect, deleteMe);


// Admin-only routes
router.get('/admin/dashboard', adminOnly, (req, res) => {
  res.json({ success: true, message: 'Welcome to admin dashboard', user: req.user });
});

router.get('/admin/users', adminOnly, async (req, res) => {
  try {
    const [users] = await require('../database').query(
       'SELECT UserId as id, FirstName as firstName, LastName as lastName, Email as email, Role as role FROM user'
    );
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Company & admin route
router.get('/company/dashboard', requireAnyRole('admin', 'company'), (req, res) => {
  res.json({ success: true, message: 'Welcome to company dashboard', user : req.user });
});

// User-only route
router.get('/user/dashboard', requireRole('user'), (req, res) => {
  res.json({ success: true, message: 'Welcome to user dashboard', user: req.user });
});

module.exports = router;