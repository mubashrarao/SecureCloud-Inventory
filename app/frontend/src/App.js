import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 Login to SecureCloud</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        <p>Demo: admin@securecloud.com / Admin123</p>
      </div>
    </div>
  );
}

function Register({ onRegister }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', formData);
      alert('Registration successful! Please login.');
      onRegister();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>📝 Register New Account</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (editingId) {
      await axios.put(`http://localhost:5000/api/products/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
    } else {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setFormData({ name: '', category: '', price: '', quantity: '', description: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData(product);
  };

  const stats = {
    total: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    lowStock: products.filter(p => p.quantity < 10).length
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>🏪 SecureCloud Inventory Manager</h1>
        <div className="user-info">
          <span>👤 {user?.username}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="stats-container">
        <div className="stat-card">
          <h3>📦 Total Products</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>💰 Inventory Value</h3>
          <p>${stats.totalValue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>⚠️ Low Stock</h3>
          <p>{stats.lowStock}</p>
        </div>
      </div>

      <div className="main-content">
        <div className="product-form">
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Furniture">Furniture</option>
            </select>
            <input type="number" placeholder="Price ($)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
            <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', category: '', price: '', quantity: '', description: '' }); }}>Cancel</button>}
          </form>
        </div>

        <div className="product-list">
          <h3>📋 Product Inventory</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.quantity < 10 ? <span className="badge low">Low Stock</span> : <span className="badge ok">In Stock</span>}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={<Register onRegister={() => window.location.href="/login"} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
