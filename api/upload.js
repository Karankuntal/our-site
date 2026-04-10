import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const fileStr = req.body.file;

    const result = await cloudinary.v2.uploader.upload(fileStr, {
      folder: "uploads"
    });

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}