/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <footer className="bg-slate-900 text-slate-400 py-8 text-center">
              <p>© 2024 BUYKART. All rights reserved.</p>
            </footer>
          </div>
          <Toaster position="bottom-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
