import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { addAddress } from '../api/addresses';

export default function LocationSetup() {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [addressDetails, setAddressDetails] = useState({
    houseNumber: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------
  // Get user location
  // -----------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          fetchAddress(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddressDetails((prev) => ({
        ...prev,
        city: data.address.city || data.address.town || data.address.village || '',
        state: data.address.state || '',
        postalCode: data.address.postcode || ''
      }));
    } catch (err) {
      console.error('Reverse geocoding failed', err);
    }
  };

  // -----------------------------
  // Save address and redirect
  // -----------------------------
  const handleAddressSubmit = async () => {
    setIsLoading(true);
    try {
      const { houseNumber, street, city, state, postalCode } = addressDetails;
      if (!houseNumber || !street || !city || !state || !postalCode) {
        toast.error('Please fill all required fields!');
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please log in first!');
        navigate('/login');
        return;
      }

      const payload = {
        address_line1: `${houseNumber}, ${street}`,
        address_line2: addressDetails.landmark || '',
        city,
        state,
        postal_code: postalCode.toString(),
        country: 'India',
        is_default: true
      };

      const response = await addAddress(payload);

      // Save locally if needed
      localStorage.setItem(
        'userAddress',
        JSON.stringify({ ...addressDetails, id: response.address_id, isDefault: true })
      );

      toast.success('Address saved successfully!');
      navigate('/user'); // Redirect to addresses section on user page
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.error || 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Set Your Location</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="House/Flat Number"
            value={addressDetails.houseNumber}
            onChange={(e) => setAddressDetails((prev) => ({ ...prev, houseNumber: e.target.value }))}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Street/Area"
            value={addressDetails.street}
            onChange={(e) => setAddressDetails((prev) => ({ ...prev, street: e.target.value }))}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Landmark (Optional)"
            value={addressDetails.landmark}
            onChange={(e) => setAddressDetails((prev) => ({ ...prev, landmark: e.target.value }))}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="City"
            value={addressDetails.city}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100"
          />
          <input
            type="text"
            placeholder="State"
            value={addressDetails.state}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={addressDetails.postalCode}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100"
          />
        </div>

        <button
          onClick={handleAddressSubmit}
          disabled={isLoading}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Save & Continue
            </>
          )}
        </button>
      </div>
    </div>
  );
}
