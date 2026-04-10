import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// IMPORTANT for Vercel
export const config = {
  api: {
    bodyParser: false
  }
};

function parseForm(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { files } = await parseForm(req);

    if (!files || !files.image) {
      return res.status(400).json({ error: "No file uploaded (field must be 'image')" });
    }

    const file = files.image;

    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: "our-site",
      resource_type: "auto"
    });

    return res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}