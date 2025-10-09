// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserPage from "./pages/User";
import Addresses from "./pages/Addresses";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Policies from "./pages/Policies";
import LocationSetup from "./pages/LocationSetup";
import FruitsVegetables from "./pages/FruitsVegetables";
import Chips from "./pages/Chips";
import DairyBreadEggs from "./pages/DairyBreadEggs";
import AttaRiceOilDals from "./pages/AttaRiceOilDals";
import JuiceColdDrink from "./pages/JuiceColdDrink";
import Biscuits from "./pages/Biscuits";
import IceCreamMore from "./pages/IceCreamMore";
import ChocolatesChewGumsCandy from "./pages/ChocolatesChewGumsCandy";
import MasalaDryFruits from "./pages/MasalaDryFruits";
import TeaCoffeeMore from "./pages/TeaCoffeeMore";
import SmartHome from "./pages/SmartHome";
import Tools from "./pages/Tools";
import KidsCare from "./pages/KidsCare";
import FeminineHygiene from "./pages/FeminineHygiene";
import IoTTools from "./pages/IoTTools";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import VendorLogin from "./pages/VendorLogin";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import { CartProvider } from "./context/CartContextProvider";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryRegister from "./pages/delivery/DeliveryRegister";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import Cart from "./pages/Cart";
import "./index.css";

function App() {
  return (
    <CartProvider>
      <AdminAuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/category/fruits-vegetables" element={<FruitsVegetables />} />
          <Route path="/category/chips" element={<Chips />} />
          <Route path="/category/dairy-bread-eggs" element={<DairyBreadEggs />} />
          <Route path="/category/atta-rice-oil-dals" element={<AttaRiceOilDals />} />
          <Route path="/category/juice-cold-drink" element={<JuiceColdDrink />} />
          <Route path="/category/biscuits" element={<Biscuits />} />
          <Route path="/category/ice-creams-more" element={<IceCreamMore />} />
          <Route path="/category/chocolates-chew-gums-candy" element={<ChocolatesChewGumsCandy />} />
          <Route path="/category/masala-dry-fruits" element={<MasalaDryFruits />} />
          <Route path="/category/tea-coffee-more" element={<TeaCoffeeMore />} />
          <Route path="/category/smart-home" element={<SmartHome />} />
          <Route path="/category/tools" element={<Tools />} />
          <Route path="/category/kids-care" element={<KidsCare />} />
          <Route path="/category/feminine-hygiene" element={<FeminineHygiene />} />
          <Route path="/category/iot-tools" element={<IoTTools />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/support" element={<Support />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/location-setup" element={<LocationSetup />} />
          
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          
          {/* Vendor Routes */}
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />

          {/* Delivery Partner Routes */}
          <Route path="/delivery-register" element={<DeliveryRegister />} />
          <Route path="/delivery-login" element={<DeliveryLogin />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
        </Routes>
      </AdminAuthProvider>
    </CartProvider>
  );
}

export default App;
