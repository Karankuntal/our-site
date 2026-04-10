import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  try {

    const result = await cloudinary.search
      .expression("folder:our-site")
      .sort_by("created_at","desc")
      .max_results(100)
      .execute();

    const files = result.resources.map(file => ({
      url: file.secure_url,
      public_id: file.public_id
    }));

    res.status(200).json(files);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to load images" });

  }
}