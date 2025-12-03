import React, { useState, useEffect } from 'react';
import { MapPin, Plus, X, Send, Star, User, LogOut, Menu, Filter, Clock, ArrowLeft, Navigation, ShoppingBag, List, Search, Calendar, MessageCircle, Upload, Locate, Minus, Circle, Heart, ChevronRight, Pizza, Coffee, Apple, Carrot, Sandwich, Utensils, Croissant, ChefHat, UtensilsCrossed, Link, Twitter, Share2, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react';

// --- API Service (Inlined for Single File Compatibility) ---
const BASE_URL = window.location.href.includes('localhost') 
  ? 'http://localhost:5000/api' 
  : 'https://se-project-gkzu.onrender.com/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async signup(name, email, password) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(data.token);
    return data.user;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data.user;
  }

  // Listings
  async getListings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.lat) params.append('lat', filters.lat);
    if (filters.lng) params.append('lng', filters.lng);
    if (filters.radius) params.append('radius', filters.radius);

    return this.request(`/listings?${params.toString()}`);
  }

  async createListing(listingData) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  async relistListing(id) {
    return this.request(`/listings/${id}/relist`, {
      method: 'POST',
    });
  }

  // ✅ NEW: Actually call the DELETE endpoint on the server
  async deleteListing(id) {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }
}

const api = new ApiService();

// --- Mock Data (Fallback) ---
const INITIAL_LISTINGS = [
  // Mock data removed to encourage API usage, but structure kept for reference if needed
];

const PRESET_LOCATIONS = [
    { name: 'Thapar University', lat: 30.3564, lng: 76.3647 },
    { name: 'Leela Bhawan', lat: 30.3400, lng: 76.3800 },
    { name: 'Urban Estate', lat: 30.3250, lng: 76.4000 },
];

// --- Helpers ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const getTimeRemaining = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
};

// --- Creative Components ---

const OrganicCard = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[2.5rem] shadow-lg shadow-black/5 border border-white/50 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300 ease-out ${className}`}
  >
    {children}
  </div>
);

const PillButton = ({ children, onClick, disabled, variant = 'primary', className = "" }) => {
  const baseStyle = "px-8 py-4 rounded-full font-bold tracking-tight transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3";
  
  const variants = {
    primary: "bg-[#1a1a1a] text-white hover:bg-black shadow-lg hover:shadow-xl", 
    secondary: "bg-white text-black border-2 border-gray-100 hover:border-black",
    accent: "bg-[#FF6B6B] text-white hover:bg-[#FF5252] shadow-lg shadow-red-200",
    ghost: "bg-transparent text-gray-700 hover:bg-black/5"
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- Enhanced Background Pattern ---
const DoodlesBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none mix-blend-multiply opacity-10">
        <Pizza className="absolute top-[5%] left-[5%] w-24 h-24 text-black -rotate-12" strokeWidth={1.5} />
        <Coffee className="absolute top-[5%] left-[30%] w-20 h-20 text-black rotate-12" strokeWidth={1.5} />
        <Apple className="absolute top-[5%] left-[55%] w-24 h-24 text-black rotate-45" strokeWidth={1.5} />
        <Carrot className="absolute top-[5%] left-[80%] w-28 h-28 text-black -rotate-6" strokeWidth={1.5} />
        <Sandwich className="absolute top-[30%] left-[15%] w-24 h-24 text-black rotate-12" strokeWidth={1.5} />
        <Utensils className="absolute top-[30%] left-[40%] w-20 h-20 text-black -rotate-45" strokeWidth={1.5} />
        <Croissant className="absolute top-[30%] left-[65%] w-24 h-24 text-black rotate-6" strokeWidth={1.5} />
        <ChefHat className="absolute top-[30%] left-[90%] w-32 h-32 text-black rotate-3" strokeWidth={1} />
        <div className="absolute top-[55%] left-[5%] w-24 h-24 border-4 border-black rounded-full" />
        <Pizza className="absolute top-[55%] left-[30%] w-32 h-32 text-black rotate-180" strokeWidth={1.5} />
        <Apple className="absolute top-[55%] left-[55%] w-20 h-20 text-black -rotate-12" strokeWidth={1.5} />
        <Coffee className="absolute top-[55%] left-[80%] w-16 h-16 text-black rotate-12" strokeWidth={1.5} />
        <Circle className="absolute top-[80%] left-[20%] w-4 h-4 bg-black rounded-full" />
        <Circle className="absolute top-[80%] left-[50%] w-6 h-6 border-2 border-black rounded-full" />
        <Plus className="absolute top-[80%] left-[80%] w-8 h-8 text-black rotate-45" />
    </div>
);

// --- Sub-Components ---

const ReviewsModal = ({ show, onClose, reviews, providerName }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a1a1a]/50 backdrop-blur-md p-6">
            <OrganicCard className="w-full max-w-md p-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight">Reviews</h3>
                        <p className="text-sm text-gray-500 font-medium">for {providerName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5 text-[#1a1a1a]" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-[#1a1a1a]">{review.user}</span>
                                    <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                                        <Star className="w-3 h-3 text-[#FFD700] fill-current" />
                                        <span className="text-xs font-bold">{review.rating}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{review.date}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-400 font-medium">No reviews yet.</p>
                        </div>
                    )}
                </div>
            </OrganicCard>
        </div>
    );
};

const RateSellerModal = ({ show, onClose, onSubmit, providerName }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1a1a1a]/50 backdrop-blur-md p-6">
            <OrganicCard className="w-full max-w-sm p-8 animate-in zoom-in-95 duration-200 text-center">
                <h3 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tight mb-2">Rate Seller</h3>
                <p className="text-gray-500 mb-6 font-medium">How was your experience with {providerName}?</p>
                
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star 
                                className={`w-10 h-10 transition-colors ${
                                    star <= (hoveredRating || rating) 
                                        ? 'fill-[#FFD700] text-[#FFD700]' 
                                        : 'text-gray-300'
                                }`} 
                                strokeWidth={2.5}
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a review (optional)..."
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1a1a1a] mb-6 text-sm font-medium resize-none"
                    rows="3"
                />

                <div className="flex gap-3">
                    <PillButton variant="ghost" onClick={onClose} className="flex-1">Cancel</PillButton>
                    <PillButton 
                        variant="primary" 
                        onClick={() => onSubmit(rating, comment)} 
                        disabled={rating === 0} 
                        className="flex-1"
                    >
                        Submit
                    </PillButton>
                </div>
            </OrganicCard>
        </div>
    );
};

const ShareModal = ({ show, onClose, item }) => {
    if (!show) return null;
    
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1a1a1a]/40 backdrop-blur-md p-6">
            <OrganicCard className="w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight">Share this item</h3>
                    <button onClick={onClose} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5 text-[#1a1a1a]" />
                    </button>
                </div>
                
                <div className="space-y-3">
                    <button className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#25D366]/10 rounded-2xl transition-colors group" onClick={() => alert("Opened WhatsApp (Simulated)")}>
                        <div className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-sm">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-[#25D366]">WhatsApp</span>
                    </button>

                    <button className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#1DA1F2]/10 rounded-2xl transition-colors group" onClick={() => alert("Opened Twitter (Simulated)")}>
                        <div className="w-10 h-10 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center shadow-sm">
                            <Twitter className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-[#1DA1F2]">Twitter</span>
                    </button>

                    <button className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#FFD700]/20 rounded-2xl transition-colors group" onClick={() => { navigator.clipboard.writeText(`Check out ${item.title} on TableTurn!`); alert("Link copied to clipboard!"); onClose(); }}>
                        <div className="w-10 h-10 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center shadow-sm">
                            <Link className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-black">Copy Link</span>
                    </button>
                </div>
            </OrganicCard>
        </div>
    );
};

const LocationModal = ({ setShowLocationModal, handleUpdateLocation }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/40 backdrop-blur-md p-6">
        <OrganicCard className="w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Set Location</h3>
                    <p className="text-sm text-gray-500 font-medium">Where are you hungry?</p>
                </div>
                <button onClick={() => setShowLocationModal(false)} className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                    <X className="w-6 h-6 text-[#1a1a1a]" />
                </button>
            </div>
            <div className="space-y-4">
                <PillButton variant="accent" onClick={() => {
                      if(navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((pos) => {
                              handleUpdateLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'Current Location' });
                          }, () => alert("Location access denied."));
                      }
                  }} className="w-full justify-between group">
                    <span className="flex items-center gap-3"><Locate className="w-5 h-5" /> Use My Location</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 opacity-60 group-hover:translate-x-1 transition-transform" />
                </PillButton>
                
                <div className="py-6 flex items-center gap-4">
                    <div className="h-[2px] flex-1 bg-gray-100 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Popular Spots</span>
                    <div className="h-[2px] flex-1 bg-gray-100 rounded-full"></div>
                </div>

                {PRESET_LOCATIONS.map((loc) => (
                    <button key={loc.name} onClick={() => handleUpdateLocation({ lat: loc.lat, lng: loc.lng, address: loc.name })}
                      className="w-full flex items-center justify-between p-5 bg-white border-2 border-gray-100 hover:border-black rounded-3xl font-bold text-gray-600 hover:text-black transition-all group"
                    >
                        <span className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#FFD700] transition-colors">
                                <MapPin className="w-4 h-4 text-black" />
                            </div>
                            {loc.name}
                        </span>
                    </button>
                ))}
            </div>
        </OrganicCard>
    </div>
);

const LoginView = ({ handleLogin, handleSignup, loading }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    return (
      <div className="h-screen w-screen bg-[#FFD700] flex flex-col md:flex-row overflow-hidden relative fixed inset-0">
        <DoodlesBackground />

        {/* Left Side: Brand Hero */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-20 relative z-10 pointer-events-none">
            <div className="max-w-2xl">
                {/* Logo & App Name */}
                <div className="flex flex-col items-start gap-6 mb-20 animate-in slide-in-from-left-12 duration-700 relative">
                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
                    
                    <div className="relative">
                        <div className="w-24 h-24 bg-[#1a1a1a] rounded-[2rem] flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] rotate-3 border-4 border-black transition-transform hover:rotate-6 hover:scale-105">
                            <UtensilsCrossed className="w-12 h-12 text-[#FFD700]" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-white border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm rotate-[-6deg]">
                            Est. 2024
                        </div>
                    </div>
                    
                    <div>
                         <h1 className="text-7xl font-black tracking-tighter text-[#1a1a1a] leading-[0.8] drop-shadow-sm">
                            TABLE<br/>
                            <span className="text-white text-stroke-3 text-stroke-black drop-shadow-md">TURN</span>
                        </h1>
                    </div>
                </div>

                <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full mb-8 shadow-xl shadow-black/5 transform -rotate-2">
                    <div className="bg-[#FF6B6B] p-1.5 rounded-full"><Star className="w-4 h-4 text-white fill-current" /></div>
                    <span className="text-sm font-black uppercase tracking-wider text-black">#1 Community Food App</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-[0.9] tracking-tighter mb-8 drop-shadow-sm">
                    SHARE<br/>
                    <span className="text-white drop-shadow-md">FOOD.</span><br/>
                    <span className="text-[#1a1a1a]">TRUST.</span>
                </h2>
                <p className="text-xl font-bold text-[#1a1a1a]/70 max-w-md leading-relaxed ml-2">
                    Turn your surplus into someone's supper. Join the neighborhood movement today.
                </p>
            </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
            <OrganicCard className="w-full max-w-md p-10 bg-white/95 backdrop-blur-sm">
                <div className="flex bg-gray-100 p-1.5 rounded-full mb-10">
                    <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-full text-sm font-bold tracking-wide transition-all ${isLogin ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-black'}`}>Login</button>
                    <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-full text-sm font-bold tracking-wide transition-all ${!isLogin ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-black'}`}>Join</button>
                </div>

                <div className="space-y-6">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white focus:outline-none font-bold text-lg transition-all placeholder:text-gray-300" placeholder="Jane Doe" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white focus:outline-none font-bold text-lg transition-all placeholder:text-gray-300" placeholder="hello@email.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white focus:outline-none font-bold text-lg transition-all placeholder:text-gray-300" placeholder="••••••••" />
                    </div>
                    
                    <PillButton onClick={() => isLogin ? handleLogin(email, password) : handleSignup(name, email, password)} disabled={loading} className="w-full mt-4 justify-between group !py-5 text-lg">
                        <span>{loading ? 'Processing...' : (isLogin ? 'Enter Kitchen' : 'Start Sharing')}</span>
                        <div className="bg-white/20 p-2 rounded-full group-hover:translate-x-1 transition-transform">
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </div>
                    </PillButton>
                </div>
            </OrganicCard>
        </div>
      </div>
    );
};

const MapView = ({ currentUser, setView, setShowMenu, showMenu, setShowLocationModal, searchQuery, setSearchQuery, searchRadius, setSearchRadius, filterType, setFilterType, filteredListings, setSelectedListing }) => {
    return (
    <div className="h-screen flex flex-col bg-[#FDFDFD]">
      {/* Scrollable Container for Entire Page */}
      <div className="flex-1 overflow-y-auto w-full relative"> 
          
          {/* Yellow Branding Header (Scrolls Away) - REDUCED HEIGHT */}
          <div className="bg-[#FFD700] px-6 pt-2 pb-8 rounded-b-[0rem] relative z-10 w-full">
              <DoodlesBackground />
              <div className="relative z-10 flex items-center justify-between gap-2 py-2">
                  {/* Left: Location */}
                  <div className="flex items-center gap-3 cursor-pointer group bg-white/30 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white/40 hover:bg-white/50 transition-all max-w-[30%]" onClick={() => setShowLocationModal(true)}>
                      <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#FFD700] shadow-lg transform group-hover:rotate-12 transition-transform shrink-0">
                          <MapPin className="w-4 h-4" />
                      </div>
                      <div className="leading-none min-w-0">
                          <p className="text-[10px] font-bold text-[#1a1a1a] truncate flex items-center gap-1">
                              {currentUser?.location?.address?.split(',')[0] || "Location"}
                          </p>
                      </div>
                  </div>

                  {/* Center: Logo with Dual Tone */}
                  <div className="flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center shadow-sm -rotate-3 border border-white/20">
                              <UtensilsCrossed className="w-4 h-4 text-[#FFD700]" strokeWidth={2.5} />
                          </div>
                          <h1 className="text-xl drop-shadow-sm font-black tracking-tighter text-[#1a1a1a] hidden sm:block">
                              TABLE<span className="text-white" style={{ WebkitTextStroke: '0px #1a1a1a' }}>TURN</span>
                          </h1>
                      </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex gap-2 shrink-0">
                      <button onClick={() => setView('create')} className="w-10 h-10 bg-white text-[#1a1a1a] rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-90 transition-all border-2 border-transparent hover:border-[#1a1a1a]">
                          <Plus className="w-5 h-5" strokeWidth={3} />
                      </button>
                      <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all">
                          <Menu className="w-5 h-5" />
                      </button>
                  </div>
              </div>
          </div>

          {/* Overlapping Search & Filter Section - SCROLLS WITH PAGE */}
          <div className="-mt-6 px-6 pb-6 pointer-events-none relative z-20"> 
             {/* Search Container - Pointer events auto enabled for children */}
             <div className="pointer-events-auto">
                <div className="flex gap-3 bg-white p-2 rounded-[2rem] shadow-xl shadow-black/5 w-full border border-gray-50">
                        <div className="flex-1 relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
                            <input 
                                type="text" 
                                placeholder="Search for pasta..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-4 py-3.5 bg-transparent focus:outline-none font-bold text-lg text-[#1a1a1a] placeholder:text-gray-300"
                            />
                        </div>
                        <div className="flex items-center bg-gray-50 rounded-[1.5rem] px-2 gap-2 border border-gray-100">
                            <button onClick={() => setSearchRadius(prev => Math.max(1, prev - 1))} className="p-3 hover:bg-white hover:shadow-sm rounded-full transition-all"><Minus className="w-4 h-4 text-gray-600" /></button>
                            <span className="text-sm font-black w-10 text-center text-[#1a1a1a]">{searchRadius}km</span>
                            <button onClick={() => setSearchRadius(prev => Math.min(20, prev + 1))} className="p-3 hover:bg-white hover:shadow-sm rounded-full transition-all"><Plus className="w-4 h-4 text-gray-600" /></button>
                        </div>
                </div>

                {/* Filter Tabs - FIX: Increased padding (py-4) to prevent border cropping */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar w-full mt-2 py-4 px-1">
                    {['all', 'prepared', 'produce', 'bakery'].map(type => (
                        <button key={type} onClick={() => setFilterType(type)} 
                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap shadow-sm hover:-translate-y-0.5 ${filterType === type ? 'bg-[#1a1a1a] text-white ring-2 ring-black ring-offset-2' : 'bg-white/90 backdrop-blur text-gray-600 border border-gray-200 hover:bg-white'}`}>
                        {type === 'all' ? 'All Food' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
             </div>
          </div>

          {/* Listings Grid */}
          <div className="px-6 pb-24 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredListings.map(listing => (
                <OrganicCard key={listing.id} onClick={() => { setSelectedListing(listing); setView('detail'); }} className="cursor-pointer group flex flex-col h-full">
                <div className="relative h-64 overflow-hidden bg-gray-100 rounded-t-[2.5rem] rounded-b-[1rem]">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                    <div className="absolute top-4 left-4">
                        <span className="bg-white/95 backdrop-blur text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-black uppercase tracking-wide shadow-sm">{listing.price}</span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-[#1a1a1a]/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#FFD700]" /> {getTimeRemaining(listing.expiresAt)}
                    </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="font-black text-xl text-[#1a1a1a] leading-tight line-clamp-2">{listing.title}</h3>
                    <div className="bg-[#FFD700]/20 p-2 rounded-full shrink-0 flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#FFD700] fill-current" />
                        <span className="text-xs font-bold">{listing.rating}</span>
                    </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 line-clamp-2 mb-6 leading-relaxed">{listing.description}</p>
                    <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600 border border-gray-200">
                            {listing.provider.charAt(0)}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-400 truncate">{listing.provider}</span>
                    </div>
                </div>
                </OrganicCard>
            ))}
            </div>
            
            {filteredListings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Search className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-300 uppercase">No Food Found</h3>
            </div>
            )}
          </div>
      </div>

      {/* Menu Overlay */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40 bg-[#1a1a1a]/40 backdrop-blur-md transition-opacity" onClick={() => setShowMenu(false)} />
          <div className="absolute top-24 right-6 bg-white rounded-[2.5rem] p-8 w-80 z-50 animate-in slide-in-from-top-6 duration-300 shadow-2xl">
            <div className="flex items-center gap-5 mb-8 pb-8 border-b-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-[#FFD700] text-[#1a1a1a] rounded-2xl rotate-3 flex items-center justify-center text-3xl font-black shadow-md">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="font-black text-xl text-[#1a1a1a] leading-none mb-2">{currentUser?.name}</h3>
                    <div className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 border border-gray-100">
                        <Star className="w-3.5 h-3.5 text-[#FFD700] fill-current" /> {currentUser?.rating?.toFixed(1) || 'New'}
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                 <button onClick={() => { setView('myListings'); setShowMenu(false); }} className="w-full flex items-center gap-4 px-6 py-4 bg-gray-50 hover:bg-[#FFD700] rounded-2xl font-bold text-[#1a1a1a] transition-colors group">
                    <List className="w-6 h-6 text-gray-400 group-hover:text-black" /> My Listings
                 </button>
                 <button onClick={() => { setView('myOrders'); setShowMenu(false); }} className="w-full flex items-center gap-4 px-6 py-4 bg-gray-50 hover:bg-[#FFD700] rounded-2xl font-bold text-[#1a1a1a] transition-colors group">
                    <ShoppingBag className="w-6 h-6 text-gray-400 group-hover:text-black" /> My Orders
                 </button>
                 <button onClick={() => { setView('wishlist'); setShowMenu(false); }} className="w-full flex items-center gap-4 px-6 py-4 bg-gray-50 hover:bg-[#FFD700] rounded-2xl font-bold text-[#1a1a1a] transition-colors group">
                    <Heart className="w-6 h-6 text-gray-400 group-hover:text-black" /> My Wishlist
                 </button>
            </div>
            <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100">
                <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 py-4 rounded-2xl transition-colors">Sign Out</button>
            </div>
          </div>
        </>
      )}
    </div>
    );
};

const DetailView = ({ selectedListing, setView, currentUser, handleClaimListing, handleStartChat, wishlist, toggleWishlist }) => {
    const [showShare, setShowShare] = useState(false);
    const [showReviews, setShowReviews] = useState(false);

    return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <ShareModal show={showShare} onClose={() => setShowShare(false)} item={selectedListing} />
      <ReviewsModal show={showReviews} onClose={() => setShowReviews(false)} reviews={selectedListing?.reviews} providerName={selectedListing?.provider} />
      
      <div className="relative z-30 bg-[#FFD700] px-4 py-4 flex items-center justify-between shadow-sm">
          <button onClick={() => setView('map')} className="p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors backdrop-blur-md"><ArrowLeft className="w-6 h-6 text-[#1a1a1a]" /></button>
          <div className="flex gap-2">
             <button onClick={() => setShowShare(true)} className="p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors backdrop-blur-md"><Upload className="w-5 h-5 text-[#1a1a1a]" /></button>
             <button onClick={() => toggleWishlist(selectedListing.id)} className="p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors backdrop-blur-md">
                 <Heart className={`w-5 h-5 ${wishlist.includes(selectedListing.id) ? 'fill-red-500 text-red-500' : 'text-[#1a1a1a]'}`} />
             </button>
          </div>
      </div>

      <div className="w-full bg-[#FDFDFD]">
        {/* Full Width Image - FIX: Blurred background fill + Contain foreground */}
        <div className="relative h-[50vh] w-full bg-gray-900 overflow-hidden">
            {/* Background Blur Layer */}
            <div className="absolute inset-0">
                <img src={selectedListing?.image} className="w-full h-full object-cover blur-2xl opacity-100 scale-110" />
            </div>
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            
            {/* Main Image Layer */}
            <img src={selectedListing?.image} alt={selectedListing?.title} className="relative z-10 w-full h-full object-contain shadow-2xl" />
            
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 max-w-7xl mx-auto z-30">
                <div className="flex gap-3 mb-4">
                    <span className="bg-[#FF6B6B] text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">{selectedListing?.type}</span>
                    <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> {getTimeRemaining(selectedListing?.expiresAt)}
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tight drop-shadow-lg mb-2">{selectedListing?.title}</h1>
            </div>
        </div>

        <div className="px-4 md:px-8 -mt-8 relative z-20 pb-40 max-w-7xl mx-auto">
            <OrganicCard className="p-8 shadow-2xl border-white/50">
                <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#1a1a1a] text-[#FFD700] rounded-2xl rotate-3 flex items-center justify-center text-2xl font-black shadow-lg">
                            {selectedListing?.provider.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Listed By</p>
                            <p className="font-black text-xl text-[#1a1a1a]">{selectedListing?.provider}</p>
                        </div>
                    </div>
                    {selectedListing?.providerId !== currentUser?.id && (
                        <button onClick={() => handleStartChat(selectedListing)} className="p-4 bg-gray-50 text-[#1a1a1a] rounded-full hover:bg-[#FFD700] transition-colors">
                            <MessageCircle className="w-7 h-7" />
                        </button>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                         <div>
                            <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-widest mb-4">The Goods</h3>
                            <p className="text-gray-600 leading-loose text-lg font-medium">{selectedListing?.description}</p>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-6 rounded-[2rem]">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Expires</span>
                            <div className="flex items-center gap-2 font-bold text-xl text-[#1a1a1a]"><Clock className="w-5 h-5 text-[#FF6B6B]" /> {getTimeRemaining(selectedListing?.expiresAt)}</div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-[2rem]">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Quantity</span>
                            <div className="font-bold text-xl text-[#1a1a1a]">{selectedListing?.quantity}</div>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl mt-6 relative group">
                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#FF4500]" />
                            {selectedListing?.location.address}
                        </div>
                        <div className="h-56 w-full relative grayscale group-hover:grayscale-0 transition-all duration-500">
                            <iframe width="100%" height="100%" src={`https://maps.google.com/maps?q=${selectedListing?.location.lat},${selectedListing?.location.lng}&z=15&output=embed`} title="Food Location" className="border-0" loading="lazy" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            </OrganicCard>
        </div>

        {selectedListing?.status === 'available' && selectedListing?.providerId !== currentUser?.id && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-gray-100 flex justify-center z-30">
              <PillButton variant="primary" onClick={() => handleClaimListing(selectedListing)} className="w-full max-w-lg text-xl py-5 shadow-2xl shadow-[#FFD700]/50 hover:shadow-[#FFD700]/80 hover:scale-[1.02]">
                Claim This • {selectedListing?.price}
              </PillButton>
            </div>
        )}
      </div>
    </div>
    );
};

const WishlistView = ({ wishlist, listings, setView }) => {
    const wishlistedItems = listings.filter(l => wishlist.includes(l.id));

    return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
       <header className="bg-white px-4 py-6 flex items-center gap-4 sticky top-0 z-20 border-b border-gray-100">
          <button onClick={() => setView('map')} className="p-3 hover:bg-gray-50 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#1a1a1a]" />
          </button>
          <h2 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tight">My Wishlist</h2>
      </header>
      
      <div className="flex-1 p-6 space-y-4 overflow-y-auto max-w-4xl mx-auto w-full">
        {wishlistedItems.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-[#1a1a1a] uppercase mb-2">No Favorites Yet</h3>
            <p className="text-gray-500 font-medium mb-10 max-w-xs leading-relaxed">Save items you want to keep an eye on!</p>
            <PillButton onClick={() => setView('map')}>Browse Food</PillButton>
          </div>
        ) : (
          wishlistedItems.map(listing => (
            <OrganicCard key={listing.id} className="flex gap-5 p-4 pr-6 items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 py-1">
                <div>
                   <h3 className="font-bold text-lg text-[#1a1a1a] leading-tight mb-2 line-clamp-1">{listing.title}</h3>
                   <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${listing.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                     {listing.status}
                   </span>
                </div>
                <div className="flex justify-between items-end mt-3 border-t border-gray-50 pt-3">
                    <p className="text-sm font-black text-[#1a1a1a]">{listing.price}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase">
                        <Clock className="w-3.5 h-3.5" /> {new Date(listing.expiresAt).toLocaleDateString()}
                    </div>
                </div>
              </div>
            </OrganicCard>
          ))
        )}
      </div>
    </div>
    );
};

const CreateListingView = ({ setView, handleCreateListing }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('prepared');
    const [image, setImage] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [dateMode, setDateMode] = useState('made'); 
    const [dateValue, setDateValue] = useState('');

    const handleImageFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setPreviewUrl(reader.result); setImage(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!title || !description || !quantity || !dateValue || !image) return;
        let calculatedExpiry = new Date().toISOString();
        if (dateMode === 'expiry') {
            calculatedExpiry = new Date(dateValue).toISOString();
        } else {
            const madeDate = new Date(dateValue);
            madeDate.setHours(madeDate.getHours() + (type === 'prepared' ? 4 : 48));
            calculatedExpiry = madeDate.toISOString();
        }
        handleCreateListing({ title, description, quantity, price: price || 'Free', type, image, expiresAt: calculatedExpiry, dietary: [] });
    };

    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
        {/* Unrounded Header */}
        <div className="bg-[#FFD700] px-4 py-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <button onClick={() => setView('map')} className="p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors backdrop-blur-md">
              <X className="w-6 h-6 text-[#1a1a1a]" />
            </button>
            <h2 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight">Share Food</h2>
            <div className="w-12"></div> 
        </div>

        <div className="flex-1 px-4 py-8 pb-32 overflow-y-auto max-w-2xl mx-auto w-full">
          <div className="space-y-8">
            <div className={`aspect-square sm:aspect-video rounded-[2.5rem] relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden ${previewUrl ? 'border-none' : 'border-4 border-dashed border-gray-200 hover:border-[#FFD700] bg-gray-50'}`}>
                 <input type="file" accept="image/*" onChange={handleImageFile} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                 {previewUrl ? (
                     <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold uppercase tracking-widest border-2 border-white px-6 py-2 rounded-full">Change Photo</span>
                        </div>
                     </>
                 ) : (
                     <div className="text-center p-6">
                        <div className="w-20 h-20 bg-white text-[#FFD700] rounded-full flex items-center justify-center mb-4 shadow-lg mx-auto group-hover:scale-110 transition-transform"><Upload className="w-8 h-8" /></div>
                        <p className="font-black text-xl text-gray-400 uppercase tracking-wide group-hover:text-[#1a1a1a] transition-colors">Upload Photo</p>
                     </div>
                 )}
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase ml-4 text-gray-400 tracking-widest">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Grandma's Lasagna" className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white focus:outline-none font-bold text-lg transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase ml-4 text-gray-400 tracking-widest">Details</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ingredients, allergens, pickup info..." rows="3" className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white focus:outline-none font-bold text-lg transition-all resize-none" />
                </div>
            </div>

            <div className="p-6 bg-[#FFF9E5] rounded-[2.5rem] border border-[#FFD700]/30">
                 <div className="flex gap-2 mb-6 p-1.5 bg-white rounded-full shadow-sm">
                    <button onClick={() => setDateMode('made')} className={`flex-1 py-3 rounded-full font-bold text-xs uppercase tracking-wide transition-all ${dateMode === 'made' ? 'bg-[#1a1a1a] text-white shadow-lg' : 'text-gray-400 hover:text-[#1a1a1a]'}`}>Made Date</button>
                    <button onClick={() => setDateMode('expiry')} className={`flex-1 py-3 rounded-full font-bold text-xs uppercase tracking-wide transition-all ${dateMode === 'expiry' ? 'bg-[#1a1a1a] text-white shadow-lg' : 'text-gray-400 hover:text-[#1a1a1a]'}`}>Expiry Date</button>
                 </div>
                 <div className="relative">
                     <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input type="datetime-local" value={dateValue} onChange={(e) => setDateValue(e.target.value)} className="w-full pl-14 pr-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-[#FFD700] bg-white font-bold text-gray-700 shadow-sm" />
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-4 text-gray-400 tracking-widest">Qty</label>
                <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="2 kg" className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white focus:outline-none font-bold transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-4 text-gray-400 tracking-widest">Price</label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Free" className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white focus:outline-none font-bold transition-all" />
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-4 text-gray-400 tracking-widest">Category</label>
                <div className="relative">
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white focus:outline-none font-bold transition-all appearance-none text-[#1a1a1a]">
                    <option value="prepared">Prepared Meal</option>
                    <option value="produce">Fresh Produce</option>
                    <option value="bakery">Bakery Item</option>
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                </div>
            </div>

            <PillButton onClick={handleSubmit} disabled={!title || !description || !quantity || !dateValue || !image} className="w-full py-5 text-xl shadow-2xl hover:-translate-y-1">
              Publish Listing
            </PillButton>
          </div>
        </div>
      </div>
    );
};

// ==========================================
// UPDATED COMPONENT: MyListingsView
// ==========================================
const MyListingsView = ({ myListings, setView, onRelist, onDelete }) => (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
       <header className="bg-white px-4 py-6 flex items-center gap-4 sticky top-0 z-20 border-b border-gray-100">
          <button onClick={() => setView('map')} className="p-3 hover:bg-gray-50 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#1a1a1a]" />
          </button>
          <h2 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tight">My Kitchen</h2>
      </header>
      
      <div className="flex-1 p-6 space-y-4 overflow-y-auto max-w-4xl mx-auto w-full">
        {myListings.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-32 h-32 bg-[#FFF9E5] rounded-full flex items-center justify-center mb-8 animate-pulse">
              <List className="w-12 h-12 text-[#FFD700]" />
            </div>
            <h3 className="text-2xl font-black text-[#1a1a1a] uppercase mb-2">Nothing Cooking?</h3>
            <p className="text-gray-500 font-medium mb-10 max-w-xs leading-relaxed">You haven't listed any items yet.</p>
            <PillButton onClick={() => setView('create')}>List Your First Item</PillButton>
          </div>
        ) : (
          myListings.map(listing => (
            <OrganicCard key={listing.id} className="flex flex-col md:flex-row gap-5 p-4 pr-6 items-center">
              <div className="w-full md:w-24 h-48 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 py-1 w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-[#1a1a1a] leading-tight mb-2 line-clamp-1">{listing.title}</h3>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${listing.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                          {listing.status}
                        </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col gap-2 items-end">
                        {listing.status === 'available' && (
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    if(window.confirm('Remove this listing permanently?')) onDelete(listing.id);
                                }}
                                className="text-[10px] font-bold text-red-500 border-2 border-red-100 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" />
                                Remove
                            </button>
                        )}

                        {listing.status === 'claimed' && (
                            <div className="flex gap-2">
                                {/* Order Cancelled Button */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        if(window.confirm('Mark order as cancelled? This will make the listing available again.')) onRelist(listing.id);
                                    }}
                                    className="text-[10px] font-bold text-red-500 border-2 border-red-100 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <XCircle className="w-3 h-3" />
                                    Order Cancelled
                                </button>

                                {/* Order Done Button */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        if(window.confirm('Confirm order done? This will delete the listing permanently.')) onDelete(listing.id);
                                    }}
                                    className="text-[10px] font-bold text-emerald-600 border-2 border-emerald-100 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <CheckCircle className="w-3 h-3" />
                                    Order Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-end mt-3 border-t border-gray-50 pt-3">
                    <p className="text-sm font-black text-[#1a1a1a]">{listing.price}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase">
                        <Clock className="w-3.5 h-3.5" /> {new Date(listing.expiresAt).toLocaleDateString()}
                    </div>
                </div>
              </div>
            </OrganicCard>
          ))
        )}
      </div>
    </div>
);

const MyOrdersView = ({ myOrders, setView, onRateClick }) => (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
       <header className="bg-white px-4 py-6 flex items-center gap-4 sticky top-0 z-20 border-b border-gray-100">
          <button onClick={() => setView('map')} className="p-3 hover:bg-gray-50 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#1a1a1a]" />
          </button>
          <h2 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tight">My Orders</h2>
      </header>
      
      <div className="flex-1 p-6 space-y-4 overflow-y-auto max-w-4xl mx-auto w-full">
        {myOrders.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-[#1a1a1a] uppercase mb-2">Empty Stomach?</h3>
            <p className="text-gray-500 font-medium mb-10 max-w-xs leading-relaxed">You haven't claimed any food yet. Go find something tasty nearby!</p>
            <PillButton onClick={() => setView('map')}>Browse Food</PillButton>
          </div>
        ) : (
          myOrders.map(listing => (
            <OrganicCard key={listing.id} className="flex gap-5 p-4 pr-6 items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 grayscale">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-[#1a1a1a] leading-tight mb-2 line-clamp-1">{listing.title}</h3>
                        <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider bg-[#1a1a1a] text-white">Claimed</span>
                    </div>
                    <button onClick={() => onRateClick(listing)} className="text-xs font-bold text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors">Rate Seller</button>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-400 mt-4 uppercase tracking-wide">
                    <MapPin className="w-3.5 h-3.5" /> <span className="line-clamp-1">{listing.location.address}</span>
                </div>
              </div>
            </OrganicCard>
          ))
        )}
      </div>
    </div>
);

const ChatView = ({ setView, selectedListing, chatMessages, currentUser, messageInput, setMessageInput, handleSendMessage }) => (
    <div className="h-screen flex flex-col bg-[#FDFDFD]">
      <header className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm border-b border-gray-100 z-10">
        <button onClick={() => setView('map')} className="p-3 hover:bg-gray-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#1a1a1a]" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl rotate-3 flex items-center justify-center text-emerald-700 font-black text-lg shadow-sm">
            {selectedListing?.provider.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-[#1a1a1a] leading-none text-lg">{selectedListing?.provider}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1 truncate max-w-[150px]">{selectedListing?.title}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === currentUser?.id ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] font-medium shadow-sm text-sm ${msg.sender === 'system' ? 'bg-gray-100 text-gray-500 text-xs font-bold text-center mx-auto w-full tracking-wide uppercase' : msg.sender === currentUser?.id ? 'bg-[#1a1a1a] text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-md'}`}>
              {msg.sender !== 'system' && msg.sender !== currentUser?.id && (
                <p className="text-[10px] font-black mb-1 opacity-40 uppercase tracking-widest">{msg.senderName}</p>
              )}
              {msg.text}
            </div>
            {msg.sender !== 'system' && (
              <span className="text-[10px] font-bold text-gray-300 mt-2 px-2 uppercase tracking-wide">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-4 safe-area-bottom border-t border-gray-100">
        <div className="flex gap-2 items-center bg-gray-50 rounded-full px-2 py-2 pr-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1a1a1a] transition-all shadow-inner max-w-3xl mx-auto w-full">
          <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 bg-transparent border-none focus:ring-0 text-[#1a1a1a] font-medium placeholder:text-gray-400 px-6" />
          <button onClick={handleSendMessage} disabled={!messageInput.trim()} className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center text-[#1a1a1a] hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 shadow-md">
            <Send className="w-5 h-5 ml-0.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
);

// --- Main App Component ---

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); 
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [selectedListing, setSelectedListing] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRadius, setSearchRadius] = useState(5); 
  const [showMenu, setShowMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  
  // Rating State
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [itemToRate, setItemToRate] = useState(null);

  // Handlers
  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
        const user = await api.login(email, password);
        setCurrentUser(user);
        setView('map');
    } catch (error) {
        alert('Login failed: ' + error.message);
    } finally {
        setLoading(false);
    }
  };
  
  const handleSignup = async (name, email, password) => {
    setLoading(true);
    try {
        const user = await api.signup(name, email, password);
        setCurrentUser(user);
        setView('map');
    } catch (error) {
        alert('Signup failed: ' + error.message);
    } finally {
        setLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      const data = await api.getListings({
        type: filterType,
        search: searchQuery,
        lat: currentUser?.location?.lat,
        lng: currentUser?.location?.lng,
        radius: searchRadius
      });
      setListings(data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  };

  useEffect(() => {
    if (currentUser && view === 'map') {
      fetchListings();
    }
  }, [currentUser, view, filterType, searchQuery, searchRadius]);

  const handleUpdateLocation = (location) => { setCurrentUser(prev => ({ ...prev, location: { ...prev.location, ...location } })); setShowLocationModal(false); };
  
  const handleCreateListing = async (listingData) => {
    try {
      await api.createListing(listingData);
      await fetchListings(); // Refresh listings from server
      setView('map');
    } catch (error) {
      alert('Failed to create listing: ' + error.message);
    }
  };

  const handleClaimListing = (listing) => { 
      const updatedListings = listings.map(l => l.id === listing.id ? { ...l, status: 'claimed', claimedBy: currentUser.id } : l); 
      setListings(updatedListings); 
      setSelectedListing({ ...listing, status: 'claimed' }); 
      setChatMessages([{ id: 1, sender: 'system', text: `You claimed "${listing.title}". Coordinate pickup with ${listing.provider}.`, timestamp: new Date().toISOString() }]); 
      setView('chat'); 
  };
  
  const handleStartChat = (listing) => { setSelectedListing(listing); setChatMessages([{ id: 1, sender: 'system', text: `Starting chat about "${listing.title}"`, timestamp: new Date().toISOString() }]); setView('chat'); };
  const handleSendMessage = () => { if (messageInput.trim()) { setChatMessages([...chatMessages, { id: chatMessages.length + 1, sender: currentUser.id, senderName: currentUser.name, text: messageInput, timestamp: new Date().toISOString() }]); setMessageInput(''); } };
  
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
        setWishlist(prev => prev.filter(itemId => itemId !== id));
    } else {
        setWishlist(prev => [...prev, id]);
    }
  };

  const handleRateClick = (item) => {
      setItemToRate(item);
      setRateModalOpen(true);
  };

  const handleRatingSubmit = (score, comment) => {
      const updatedListings = listings.map(l => {
          if (l.providerId === itemToRate.providerId) {
              const newCount = (l.reviewCount || 0) + 1;
              const currentTotal = l.rating * (l.reviewCount || 0);
              const newRating = ((currentTotal + score) / newCount).toFixed(1);
              const newReview = { id: Date.now(), user: currentUser.name || "User", rating: score, text: comment || "No comment provided.", date: "Just now" };
              return { ...l, rating: parseFloat(newRating), reviewCount: newCount, reviews: [newReview, ...(l.reviews || [])] };
          }
          return l;
      });
      setListings(updatedListings);
      setRateModalOpen(false);
      setItemToRate(null);
      alert("Thank you for rating the seller!");
  };

  // ✅ UPDATED: Delete function now calls backend API
  const handleDeleteListing = async (listingId) => {
      try {
          // 1. Call Backend
          await api.deleteListing(listingId);
          
          // 2. Update Local State (UI)
          const updatedListings = listings.filter(l => l.id !== listingId);
          setListings(updatedListings);
      } catch (error) {
          alert('Failed to delete listing: ' + error.message);
      }
  };

  // --- RELIST Function (Updated Feature) ---
  const handleRelist = async (listingId) => {
      try {
        // Optimistic UI update
        const updatedListings = listings.map(l => 
            l.id === listingId ? { ...l, status: 'available', claimedBy: null } : l
        );
        setListings(updatedListings);
        
        // Try backend call if supported
        await api.relistListing(listingId); 
      } catch (error) {
        console.warn("Backend relist might not be implemented, but UI updated.");
      }
  };

  // Logic
  const filteredListings = listings.filter(l => {
    if (l.status !== 'available') return false;
    if (filterType !== 'all' && l.type !== filterType) return false;
    if (searchQuery) { const query = searchQuery.toLowerCase(); if (!l.title.toLowerCase().includes(query) && !l.description.toLowerCase().includes(query) && !l.type.toLowerCase().includes(query)) return false; }
    if (currentUser?.location) { const distance = calculateDistance(currentUser.location.lat, currentUser.location.lng, l.location.lat, l.location.lng); if (distance > searchRadius) return false; }
    return true;
  });

  const myListings = listings.filter(l => l.providerId === currentUser?.id);
  const myOrders = listings.filter(l => l.claimedBy === currentUser?.id);

  return (
    <div className="font-sans text-[#1a1a1a] bg-[#FDFDFD] min-h-screen selection:bg-[#FFD700] selection:text-[#1a1a1a]">
      {!currentUser && <LoginView handleLogin={handleLogin} handleSignup={handleSignup} loading={loading} />}
      
      {currentUser && view === 'map' && (
        <MapView 
            currentUser={currentUser} setView={setView} setShowMenu={setShowMenu} showMenu={showMenu} setShowLocationModal={setShowLocationModal}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchRadius={searchRadius} setSearchRadius={setSearchRadius}
            filterType={filterType} setFilterType={setFilterType} filteredListings={filteredListings} setSelectedListing={setSelectedListing}
        />
      )}

      {currentUser && view === 'myListings' && <MyListingsView myListings={myListings} setView={setView} onRelist={handleRelist} onDelete={handleDeleteListing} />}
      {currentUser && view === 'myOrders' && <MyOrdersView myOrders={myOrders} setView={setView} onRateClick={handleRateClick} />}
      {currentUser && view === 'wishlist' && <WishlistView wishlist={wishlist} listings={listings} setView={setView} />}
      
      {currentUser && view === 'detail' && (
        <DetailView 
            selectedListing={selectedListing} setView={setView} currentUser={currentUser} 
            handleClaimListing={handleClaimListing} handleStartChat={handleStartChat} 
            wishlist={wishlist} toggleWishlist={toggleWishlist}
        />
      )}
      
      {currentUser && view === 'create' && <CreateListingView setView={setView} handleCreateListing={handleCreateListing} />}
      {currentUser && view === 'chat' && <ChatView setView={setView} selectedListing={selectedListing} chatMessages={chatMessages} currentUser={currentUser} messageInput={messageInput} setMessageInput={setMessageInput} handleSendMessage={handleSendMessage} />}
      
      {showLocationModal && <LocationModal setShowLocationModal={setShowLocationModal} handleUpdateLocation={handleUpdateLocation} />}
      
      {rateModalOpen && (
        <RateSellerModal show={rateModalOpen} onClose={() => setRateModalOpen(false)} onSubmit={handleRatingSubmit} providerName={itemToRate?.provider} />
      )}
    </div>
  );
};

export default App;