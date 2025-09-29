const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Kontrollo që folderi uploads ekziston
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Folder 'uploads' u krijua automatikisht.");
}

// Konfigurimi i storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Lejojmë vetëm imazhe 
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg, jpeg, png, gif) are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
