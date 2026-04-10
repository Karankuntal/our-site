import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {

    const { file } = req.body;

    const result = await cloudinary.uploader.upload(file, {
      folder: "our-site"
    });

    return res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}