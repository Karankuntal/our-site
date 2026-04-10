import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).json({ message: "Upload API running" });
  }

  try {

    // Configure cloudinary inside function
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const result = await cloudinary.uploader.upload(file, {
  folder: "our-site",
  unique_filename: true,
  overwrite: false
});

    return res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({ error: error.message });
  }

}