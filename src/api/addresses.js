import { api } from './client';

// -----------------------------
// Address API functions
// -----------------------------

// Add new address
export const addAddress = async (addressData) => {
  try {
    const response = await api.post('/api/addresses/', addressData);
    return response.data; // expected: { address_id: 1, ... }
  } catch (error) {
    console.error('Error adding address:', error.response?.data || error.message);
    throw error;
  }
};

// Get all addresses
export const getAddresses = async () => {
  try {
    const response = await api.get('/api/addresses/');
    return response.data.addresses || [];
  } catch (error) {
    console.error('Error fetching addresses:', error.response?.data || error.message);
    throw error;
  }
};

// Update an address
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`/api/addresses/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error.response?.data || error.message);
    throw error;
  }
};

// Delete an address
export const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/api/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting address:', error.response?.data || error.message);
    throw error;
  }
};

// Set default address
export const setDefaultAddress = async (addressId) => {
  try {
    const response = await api.patch(`/api/addresses/${addressId}/default`);
    return response.data;
  } catch (error) {
    console.error('Error setting default address:', error.response?.data || error.message);
    throw error;
  }
};
