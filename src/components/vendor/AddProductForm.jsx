import React, { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle, Image as ImageIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddProductForm = ({ onClose, onProductAdded, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    unit: '',
    category_id: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required (e.g., kg, pieces, liters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('vendorToken');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('stock', parseInt(formData.stock));
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('category_id', parseInt(formData.category_id));
      
      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch('http://localhost:8000/api/vendor/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Product created successfully! Pending admin approval.');
        if (onProductAdded) {
          onProductAdded();
        }
        onClose();
      } else {
        toast.error(data.error || 'Failed to create product');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Product creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-gray-900">Add New Product</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.category_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category_id}
                  </div>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price}
                  </div>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.stock ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.stock}
                  </div>
                )}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit *
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.unit ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="kg, pieces, liters, etc."
                />
                {errors.unit && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.unit}
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                
                {!imagePreview ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Drop your image here, or{' '}
                          <span className="text-green-600 hover:text-green-500">
                            browse
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="sr-only"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <p className="mt-2 text-xs text-gray-500">
                  Optional: Upload a product image (PNG, JPG, GIF up to 5MB)
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter product description"
                />
              </div>
            </div>

            {/* Info Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Approval Required</p>
                  <p>Your product will be reviewed by admin before it appears on the website.</p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
