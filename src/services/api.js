// se2/src/services/api.js
import {URL} from "../config.js"; 
const API_URL = URL;

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
      const response = await fetch(`${API_URL}${endpoint}`, config);
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

  // User
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateLocation(lat, lng, address) {
    return this.request('/users/location', {
      method: 'PUT',
      body: JSON.stringify({ lat, lng, address }),
    });
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

  async getListing(id) {
    return this.request(`/listings/${id}`);
  }

  async createListing(listingData) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  async updateListing(id, updates) {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async claimListing(id) {
    return this.request(`/listings/${id}/claim`, {
      method: 'POST',
    });
  }

  async relistListing(id) {
    return this.request(`/listings/${id}/relist`, {
      method: 'POST',
    });
  }

  async getMyListings() {
    return this.request('/listings/user/mylistings');
  }

  async getMyOrders() {
    return this.request('/listings/user/orders');
  }

  async addReview(listingId, rating, text) {
    return this.request(`/listings/${listingId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, text }),
    });
  }

  // Chat
  async getChat(listingId) {
    return this.request(`/chats/${listingId}`);
  }

  async sendMessage(listingId, text) {
    return this.request(`/chats/${listingId}/message`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/wishlist');
  }

  async addToWishlist(listingId) {
    return this.request(`/wishlist/${listingId}`, {
      method: 'POST',
    });
  }

  async removeFromWishlist(listingId) {
    return this.request(`/wishlist/${listingId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();