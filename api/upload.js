import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configuration using Environment Variables from Vercel
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "our-site",
    resource_type: "auto" // Supports both images and videos
  }
});

const upload = multer({ storage });

// Vercel config to allow Multer to handle the file data
export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req, res) {

  // Only allow POST requests for uploads
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  // Changed "file" to "image" to match: formData.append("image", file) in script.js
  upload.single("image")(req, res, function(err) {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Check if field name is 'image'" });
    }

    // Success response with permanent Cloudinary URL
    return res.status(200).json({
      url: req.file.path,          
      public_id: req.file.filename 
    });

  });
}
