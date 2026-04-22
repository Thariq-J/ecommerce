import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PackagePlus, Loader2, ImagePlus } from 'lucide-react';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPercentage: '',
    category: '',
    brand: '',
    stock: '',
    images: ''
  });

  // Redirect if not admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">You must have administrator privileges to view this page.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Split images by comma and clean whitespace
      const imageArray = formData.images
        .split(',')
        .map(img => img.trim())
        .filter(img => img.length > 0);

      // We only insert the first image as thumbnail if the backend has thumbnail mapping
      // or we just send the array to images. Let's send everything according to the backend fields.
      const productPayload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discountPercentage) || 0,
        category: formData.category.toLowerCase().replace(/\s+/g, '-'),
        brand: formData.brand,
        stock: parseInt(formData.stock),
        images: imageArray,
        thumbnail: imageArray.length > 0 ? imageArray[0] : ''
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productPayload)
      });

      if (res.ok) {
        toast.success('Product successfully added to the catalog!');
        // Reset form
        setFormData({
          title: '', description: '', price: '', discountPercentage: '', 
          category: '', brand: '', stock: '', images: ''
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add product');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving the product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="bg-[#2874f0] px-6 py-5 flex items-center gap-3">
            <PackagePlus className="w-6 h-6 text-white" />
            <h1 className="text-xl font-medium text-white tracking-wide">Add New Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                  <input
                    required
                    maxLength={150}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                    placeholder="e.g. Apple iPhone 15 Pro Max"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                    placeholder="Provide a detailed description of the product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    required
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                    placeholder="e.g. Apple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    required
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                    placeholder="e.g. smartphones"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (INR)</label>
                  <div className="relative rounded-sm shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-7 px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                  <div className="relative rounded-sm shadow-sm">
                    <input
                      required
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                      className="appearance-none block w-full pr-8 px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                    placeholder="e.g. 50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (Comma separated)</label>
                  <div className="mt-1 flex rounded-sm shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-sm border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      <ImagePlus className="w-4 h-4" />
                    </span>
                    <input
                      required
                      type="text"
                      name="images"
                      value={formData.images}
                      onChange={handleChange}
                      className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-sm focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                      placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">The first URL provided will be used as the product's main thumbnail.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-white py-2.5 px-6 border border-gray-300 rounded-sm shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2874f0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center py-2.5 px-8 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-[#fb641b] hover:bg-[#f35306] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb641b] disabled:opacity-70 transition-colors"
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Saving...</> : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
