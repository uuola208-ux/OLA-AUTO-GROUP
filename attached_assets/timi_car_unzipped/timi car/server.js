const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// IMPORTANT: Increase request size limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// 1. Database Connection
// Your Atlas URI is already integrated here
const dbURI = 'mongodb+srv://CARSS:AIcJV3hcWgM8feqS@cluster0.errfg.mongodb.net/luxury_prestige?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then(() => console.log("Database Connected: Luxury Prestige (Atlas)"))
    .catch(err => console.error("Connection Error:", err));

// 2. Data Schema - UPDATED for Multiple Images
const carSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String], // Change: This now stores an array/list of image links
    details: String,  // This stores your vehicle description
    createdAt: { type: Date, default: Date.now }
});

const Car = mongoose.model('Car', carSchema);

// 3. API Routes

// GET all cars
app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 });
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: "Error fetching cars" });
    }
});

// POST a new car (Creates the gallery and description)
app.post('/api/cars', async (req, res) => {
    try {
        console.log("📥 POST /api/cars - Received data:", req.body);
        
        // Validate and clean images array
        if (!req.body.images || req.body.images.length === 0) {
            return res.status(400).json({ message: "At least one image URL is required" });
        }
        
        // Filter out null, undefined, and empty string images
        const cleanImages = req.body.images
            .filter(img => img && typeof img === 'string' && img.trim().length > 0)
            .map(img => img.trim());
        
        if (cleanImages.length === 0) {
            return res.status(400).json({ message: "No valid image URLs provided" });
        }
        
        console.log("✅ Clean images:", cleanImages);
        
        const carData = {
            ...req.body,
            images: cleanImages
        };
        
        const newCar = new Car(carData);
        await newCar.save();
        
        console.log("💾 Car saved to DB:", newCar);
        res.status(201).json(newCar);
    } catch (err) {
        console.error("❌ Error saving car:", err);
        res.status(400).json({ message: "Error saving vehicle", error: err.message });
    }
});

// DELETE a car by ID
app.delete('/api/cars/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: "Vehicle Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting vehicle" });
    }
});

// GET a single car by ID
app.get('/api/cars/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching vehicle', error: err });
    }
});

// Update a car by ID
app.put('/api/cars/:id', async (req, res) => {
    try {
        console.log("📥 PUT /api/cars/:id - Received data:", req.body);
        
        // Validate and clean images array if provided
        let updateData = { ...req.body };
        
        if (updateData.images && Array.isArray(updateData.images)) {
            const cleanImages = updateData.images
                .filter(img => img && typeof img === 'string' && img.trim().length > 0)
                .map(img => img.trim());
            
            if (cleanImages.length === 0) {
                return res.status(400).json({ message: "At least one image is required" });
            }
            
            console.log("✅ Clean images:", cleanImages);
            updateData.images = cleanImages;
        }
        
        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        console.log("💾 Car updated in DB:", updatedCar);
        res.status(200).json(updatedCar);
    } catch (err) {
        console.error("❌ Error updating car:", err);
        res.status(400).json({ message: 'Update failed', error: err.message });
    }
});

// 4. Server Start
// Using process.env.PORT for deployment (Render/Railway) or 5000 for local testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server active on Port ${PORT}`));