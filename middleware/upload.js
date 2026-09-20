const multer = require("multer");

// memory storage so we can stream buffer to Cloudinary
const storage = multer.memoryStorage();
console.log("start authentication pics...");
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
    console.log("confimed the pics");
  } else {
    cb(new Error("Only images (jpeg, jpg, png) are allowed"));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
console.log("move the image to cloudinary..");

module.exports = upload;
