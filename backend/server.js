const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: [
    "https://se-project-1jrr.vercel.app", 
    "https://se-project-1jrr-git-main-yashtomar2201s-projects.vercel.app",
    "http://localhost:3000", 
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.options('*', cors()); // explicitly respond to preflight for any route
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// ==================== DATABASE ====================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tableturn')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==================== SCHEMAS ====================

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  createdAt: { type: Date, default: Date.now }
});

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: String,
  type: { type: String, enum: ['prepared', 'produce', 'bakery'], required: true },
  quantity: String,
  price: { type: String, default: 'Free' },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  image: String,
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['available', 'claimed', 'expired'], default: 'available' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user: String,
    rating: Number,
    text: String,
    date: { type: Date, default: Date.now }
  }],
  dietary: [String],
  createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// ==================== AUTH MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      location: {
        lat: 30.3398,
        lng: 76.3869,
        address: 'Sector 22, Patiala'
      }
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER ROUTES ====================

app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/location', authenticateToken, async (req, res) => {
  try {
    const { lat, lng, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { location: { lat, lng, address } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LISTING ROUTES ====================

app.get('/api/listings', async (req, res) => {
  try {
    const { type, search, lat, lng, radius = 20 } = req.query;
    
    let query = { status: 'available', expiresAt: { $gt: new Date() } };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let listings = await Listing.find(query).sort({ createdAt: -1 });

    // Filter by radius if location provided
    if (lat && lng) {
      listings = listings.filter(listing => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          listing.location.lat,
          listing.location.lng
        );
        return distance <= parseFloat(radius);
      });
    }

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/listings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const listing = new Listing({
      ...req.body,
      providerId: req.user.id,
      provider: user.name,
      location: user.location
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.providerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ ADDED: Delete Route for Removing Listings
app.delete('/api/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Only allow the owner (provider) to delete it
    if (listing.providerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/listings/:id/claim', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.status !== 'available') {
      return res.status(400).json({ error: 'Listing not available' });
    }

    listing.status = 'claimed';
    listing.claimedBy = req.user.id;
    await listing.save();

    // Create chat
    const chat = new Chat({
      listingId: listing._id,
      participants: [listing.providerId, req.user.id],
      messages: [{
        sender: 'system',
        senderName: 'System',
        text: `Chat started for "${listing.title}"`
      }]
    });
    await chat.save();

    res.json({ listing, chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/listings/:id/relist', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.providerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    listing.status = 'available';
    listing.claimedBy = null;
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/listings/user/mylistings', authenticateToken, async (req, res) => {
  try {
    const listings = await Listing.find({ providerId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/listings/user/orders', authenticateToken, async (req, res) => {
  try {
    const listings = await Listing.find({ claimedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== REVIEW ROUTES ====================

app.post('/api/listings/:id/review', authenticateToken, async (req, res) => {
  try {
    const { rating, text } = req.body;
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const user = await User.findById(req.user.id);

    const review = {
      userId: req.user.id,
      user: user.name,
      rating,
      text,
      date: new Date()
    };

    listing.reviews.unshift(review);
    listing.reviewCount = listing.reviews.length;
    
    // Recalculate average rating
    const totalRating = listing.reviews.reduce((sum, r) => sum + r.rating, 0);
    listing.rating = (totalRating / listing.reviewCount).toFixed(1);
    
    await listing.save();

    // Update provider's rating
    const providerListings = await Listing.find({ providerId: listing.providerId });
    const providerTotalReviews = providerListings.reduce((sum, l) => sum + l.reviewCount, 0);
    const providerTotalRating = providerListings.reduce((sum, l) => sum + (l.rating * l.reviewCount), 0);
    
    if (providerTotalReviews > 0) {
      const providerAvgRating = (providerTotalRating / providerTotalReviews).toFixed(1);
      await User.findByIdAndUpdate(listing.providerId, {
        rating: providerAvgRating,
        reviewCount: providerTotalReviews
      });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CHAT ROUTES ====================

app.get('/api/chats/:listingId', authenticateToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      listingId: req.params.listingId,
      participants: req.user.id
    });
    
    res.json(chat || { messages: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chats/:listingId/message', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const user = await User.findById(req.user.id);

    let chat = await Chat.findOne({
      listingId: req.params.listingId,
      participants: req.user.id
    });

    if (!chat) {
      const listing = await Listing.findById(req.params.listingId);
      chat = new Chat({
        listingId: req.params.listingId,
        participants: [listing.providerId, req.user.id]
      });
    }

    chat.messages.push({
      sender: req.user.id,
      senderName: user.name,
      text,
      timestamp: new Date()
    });

    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== WISHLIST ROUTES ====================

app.get('/api/wishlist', authenticateToken, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.user.id })
      .populate('listingId');
    res.json(wishlistItems.map(w => w.listingId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/wishlist/:listingId', authenticateToken, async (req, res) => {
  try {
    const existing = await Wishlist.findOne({
      userId: req.user.id,
      listingId: req.params.listingId
    });

    if (existing) {
      return res.status(400).json({ error: 'Already in wishlist' });
    }

    const wishlistItem = new Wishlist({
      userId: req.user.id,
      listingId: req.params.listingId
    });

    await wishlistItem.save();
    res.json(wishlistItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/wishlist/:listingId', authenticateToken, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      userId: req.user.id,
      listingId: req.params.listingId
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== UTILITY FUNCTIONS ====================

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ==================== SERVER START ===================

module.exports = app;

// ✅ Use Render's port, or 5000 if testing locally
const PORT = process.env.PORT || 5000;

// Listen on '0.0.0.0' to ensure Render can find the app
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
//