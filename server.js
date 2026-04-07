const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('Public')); // Serve your website files
app.use(express.json()); // Needed for delete requests

// Ensure uploads folder exists
const uploadsDir = 'Public/uploads/';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Ensure bookings.json exists
const bookingsFile = 'bookings.json';
if (!fs.existsSync(bookingsFile)) fs.writeFileSync(bookingsFile, JSON.stringify([]));

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
    const newImagePath = `/uploads/${req.file.filename}`;

    const data = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    data.push({ url: newImagePath });
    fs.writeFileSync(bookingsFile, JSON.stringify(data, null, 2));

    res.json({ url: newImagePath });
});

// Route to get all images (so they always float)
app.get('/images', (req, res) => {
    const data = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    res.json(data); // send all saved images
});

// Delete route
app.post('/delete', (req, res) => {
    const filename = req.body.filename;
    const filePath = path.join(uploadsDir, filename);

    // Remove from filesystem
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Remove from JSON
    let data = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    data = data.filter(item => item.url !== `/uploads/${filename}`);
    fs.writeFileSync(bookingsFile, JSON.stringify(data, null, 2));

    res.send('Deleted');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
