const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const app = express();

// 1. CLOUDINARY CONFIGURATION
// Replace these with the keys from your Cloudinary Dashboard
cloudinary.config({ 
  cloud_name: 'YOUR_CLOUD_NAME', 
  api_key: 'YOUR_API_KEY', 
  api_secret: 'YOUR_API_SECRET',
  secure: true 
});

app.use(express.static('public')); 
app.use(express.json());

// 2. MULTER CONFIG (Storage in memory for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Temporary array (Note: For 100% permanent data, use Firebase/MongoDB later)
let memoryDatabase = []; 

// UPLOAD ROUTE (Saves to Cloudinary)
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");

        // Convert file buffer to base64 for Cloudinary
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: 'couple_site',
            resource_type: 'auto'
        });

        const newEntry = { url: result.secure_url, public_id: result.public_id };
        memoryDatabase.push(newEntry);

        res.json(newEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Upload to Cloudinary failed" });
    }
});

// GET IMAGES ROUTE
app.get('/api/images', (req, res) => {
    res.json(memoryDatabase);
});

// DELETE ROUTE (Removes from Cloudinary)
app.post('/api/delete', async (req, res) => {
    try {
        const { public_id } = req.body;
        await cloudinary.uploader.destroy(public_id);
        memoryDatabase = memoryDatabase.filter(item => item.public_id !== public_id);
        res.send('Deleted');
    } catch (error) {
        res.status(500).send("Delete failed");
    }
});

module.exports = app;
