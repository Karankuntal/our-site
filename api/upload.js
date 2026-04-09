import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "our-site",
    resource_type: "auto"
  }
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  upload.single("file")(req, res, function(err) {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    return res.status(200).json({
      url: req.file.path,          // Cloudinary media URL
      public_id: req.file.filename // needed for deleting later
    });

  });

}