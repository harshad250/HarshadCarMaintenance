const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/car_service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Add other configuration as needed
});

// MongoDB Schemas
const userSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true },
    email: String,
    vehicle: String,
    vehicleNumber: String,
    bookings: [{
        bookingTime: Date,
        service: String,
        price: Number,
        status: String,
        provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }
    }]
});

const providerSchema = new mongoose.Schema({
    shopName: String,
    username: { type: String, unique: true },
    phone: { type: String, unique: true },
    email: String,
    businessHours: String,
    bookings: [{
        bookingTime: Date,
        service: String,
        price: Number,
        status: String,
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
});

const User = mongoose.model('User', userSchema);
const Provider = mongoose.model('Provider', providerSchema);

// Routes

// Verify Firebase token middleware
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// User Routes
app.post('/api/users', verifyToken, async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/users/:phone', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.params.phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Provider Routes
app.post('/api/providers', verifyToken, async (req, res) => {
    try {
        const provider = new Provider(req.body);
        await provider.save();
        res.status(201).json(provider);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/providers/:phone', verifyToken, async (req, res) => {
    try {
        const provider = await Provider.findOne({ phone: req.params.phone });
        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }
        res.json(provider);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Booking Routes
app.post('/api/bookings', verifyToken, async (req, res) => {
    try {
        const { userId, providerId, booking } = req.body;
        
        const user = await User.findById(userId);
        const provider = await Provider.findById(providerId);
        
        if (!user || !provider) {
            return res.status(404).json({ error: 'User or Provider not found' });
        }
        
        user.bookings.push({ ...booking, provider: providerId });
        provider.bookings.push({ ...booking, customer: userId });
        
        await user.save();
        await provider.save();
        
        res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
