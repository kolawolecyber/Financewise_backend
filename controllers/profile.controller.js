const prisma = require("../config/prisma");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
require('dotenv').config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});
// GET User Settings
const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        monthlyIncome: true,
        currency: true,
        financialGoal: true,
        profilePic: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE User Settings
const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { monthlyIncome, currency, financialGoal } = req.body;

    let profilePicUrl = null;

    if (req.file) {
      console.log("req.file:", req.file);
      profilePicUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "financewise/profile_pics", 
            quality: "50",  fetch_format: "jpg", flags: "lossy",  
    fetch_format: "jpg",   
    transformation: [
      { width: 300, height: 300, crop: "limit" }, 
    ], },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result.secure_url);
              resolve(result.secure_url);
            }
          }
        );

        // Ensure the buffer is piped and stream ends properly
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
        currency,
        financialGoal,
        ...(profilePicUrl && { profilePic: profilePicUrl }), // only set if uploaded
      },
      select: {
        id: true,
        name: true,
        email: true,
        monthlyIncome: true,
        currency: true,
        financialGoal: true,
        profilePic: true,
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};




module.exports = { getUserSettings, updateUserSettings };
