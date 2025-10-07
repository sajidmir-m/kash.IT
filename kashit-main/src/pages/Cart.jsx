import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowLeft, Tag, ChevronRight, Wallet, MapPin, Pencil, Save, X, Package, Wrench, Truck, Receipt, Ticket } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { validateCoupon } from "../api/coupons";
import { createOrder } from "../api/orders";
import { getAddresses, updateAddress } from "../api/addresses";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  // coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null); // {code, discount_amount, final_amount}
  const [couponError, setCouponError] = useState("");
  const [validating, setValidating] = useState(false);

  // address state (simple: read default address presence from API page localStorage or a quick flag)
  const [hasAddress, setHasAddress] = useState(false);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [address, setAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ address_line1: "", address_line2: "", city: "", state: "", postal_code: "" });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    // Load default address from API; fallback to cached if available
    (async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return; // not logged in
        const list = await getAddresses();
        const def = list.find(a => a.is_default) || list[0];
        if (def) {
          setHasAddress(true);
          setDefaultAddressId(def.id);
          setAddress(def);
          setAddressForm({
            address_line1: def.address_line1 || "",
            address_line2: def.address_line2 || "",
            city: def.city || "",
            state: def.state || "",
            postal_code: def.postal_code || ""
          });
          try { localStorage.setItem('defaultAddress', JSON.stringify(def)); } catch {}
        } else {
          // fallback to cache
          const cached = localStorage.getItem('defaultAddress');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed?.id) {
              setHasAddress(true);
              setDefaultAddressId(parsed.id);
              setAddress(parsed);
              setAddressForm({
                address_line1: parsed.address_line1 || "",
                address_line2: parsed.address_line2 || "",
                city: parsed.city || "",
                state: parsed.state || "",
                postal_code: parsed.postal_code || ""
              });
            }
          }
        }
      } catch {}
    })();
  }, []);

  const subtotal = getCartTotal();
  const handlingFee = subtotal > 0 ? 10 : 0; // example flat handling
  const deliveryFee = subtotal >= 150 || subtotal === 0 ? 0 : 40; // free over 150
  const gst = Math.round(subtotal * 0.05); // 5% GST example
  const discount = Math.round(couponApplied?.discount_amount || 0);
  const toPay = useMemo(() => {
    const base = subtotal + handlingFee + deliveryFee + gst;
    return Math.max(0, base - discount);
  }, [subtotal, handlingFee, deliveryFee, gst, discount]);

  const onApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) return;
    try {
      setValidating(true);
      const res = await validateCoupon(couponCode.trim(), subtotal);
      setCouponApplied(res);
    } catch (e) {
      setCouponApplied(null);
      setCouponError(e?.message || "Failed to apply coupon");
    } finally {
      setValidating(false);
    }
  };

  const onPlaceOrder = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    if (!hasAddress || !defaultAddressId) {
      navigate('/addresses');
      return;
    }
    try {
      const payload = {
        address_id: defaultAddressId,
        coupon_code: couponApplied?.code || undefined
      };
      const data = await createOrder(payload);
      // naive success path: clear local cart and go to orders page
      clearCart();
      navigate('/orders');
    } catch (e) {
      // surface minimal error
      alert(e?.message || 'Failed to create order');
    }
  };

  const onSaveAddress = async () => {
    if (!defaultAddressId) return;
    try {
      setSavingAddress(true);
      const body = {
        address_line1: addressForm.address_line1,
        address_line2: addressForm.address_line2,
        city: addressForm.city,
        state: addressForm.state,
        postal_code: addressForm.postal_code
      };
      await updateAddress(defaultAddressId, body);
      const updated = { ...(address || {}), ...body };
      setAddress(updated);
      try { localStorage.setItem('defaultAddress', JSON.stringify(updated)); } catch {}
      setEditingAddress(false);
    } catch (e) {
      alert(e?.message || 'Failed to update address');
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-6">Your cart is empty.</p>
            <Link to="/products" className="inline-block px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {/* Top fixed sections: Cart + Coupons */}
              <div className="bg-white rounded-xl shadow p-0 mb-2 border border-black">
                <div className="px-3 py-2.5 flex items-center gap-2 font-semibold text-gray-900 bg-green-50 border-b border-black/10 rounded-t-xl">
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs border border-green-200">Cart</span>
                </div>
                <div className="px-3 py-2 text-xs text-gray-600">Review items in your cart</div>
              </div>

              <div className="bg-white rounded-xl shadow p-3 mb-4 border border-black">
                <div className="flex items-center gap-2 mb-2 border-b border-black/10 pb-2 bg-yellow-50 px-2 py-2 rounded">
                  <Tag className="w-4 h-4 text-green-700" />
                  <span className="font-semibold text-gray-900 text-sm">Coupons</span>
                </div>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <button
                    onClick={onApplyCoupon}
                    disabled={validating || !couponCode.trim()}
                    className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {validating ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {couponApplied && (
                  <div className="mt-2 text-xs text-green-700">Applied {couponApplied.code}: -₹{Math.round(couponApplied.discount_amount || 0)}</div>
                )}
                {couponError && (
                  <div className="mt-2 text-xs text-red-600">{couponError}</div>
                )}
              </div>

              {/* Address section with inline edit */}
              <div className="bg-white rounded-xl shadow p-3 mb-4 border border-black">
                <div className="flex items-center justify-between mb-2 border-b border-black/10 pb-2 bg-blue-50 px-2 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-700" />
                    <span className="font-semibold text-gray-900 text-sm">Delivery Address</span>
                  </div>
                  {hasAddress && !editingAddress && (
                    <button onClick={() => setEditingAddress(true)} className="flex items-center gap-1 text-green-700 hover:text-green-800 text-xs">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>
                {!hasAddress ? (
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Add address to proceed</div>
                    <Link to="/addresses" className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700">Add Address</Link>
                  </div>
                ) : (
                  <>
                    {!editingAddress ? (
                      <div className="text-xs text-gray-700">
                        <div className="font-medium text-gray-900">{address?.address_line1}</div>
                        {address?.address_line2 && <div>{address.address_line2}</div>}
                        <div>{address?.city}, {address?.state} - {address?.postal_code}</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={addressForm.address_line1} onChange={(e) => setAddressForm(v => ({...v, address_line1: e.target.value}))} placeholder="Address line 1" />
                        <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={addressForm.address_line2} onChange={(e) => setAddressForm(v => ({...v, address_line2: e.target.value}))} placeholder="Address line 2" />
                        <div className="grid grid-cols-2 gap-2">
                          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={addressForm.city} onChange={(e) => setAddressForm(v => ({...v, city: e.target.value}))} placeholder="City" />
                          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={addressForm.state} onChange={(e) => setAddressForm(v => ({...v, state: e.target.value}))} placeholder="State" />
                        </div>
                        <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={addressForm.postal_code} onChange={(e) => setAddressForm(v => ({...v, postal_code: e.target.value}))} placeholder="Postal code" />
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <button onClick={() => setEditingAddress(false)} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-xs">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button onClick={onSaveAddress} disabled={savingAddress} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-600 text-white text-xs disabled:opacity-50 hover:bg-green-700">
                            <Save className="w-3.5 h-3.5" /> {savingAddress ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {cartItems.map((item, idx) => (
                <div key={item.id} className={`${idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'} rounded-lg shadow p-3 flex gap-3 items-center border border-black`}>
                  <div className="w-[38px] h-[38px] rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500">₹{item.price} each</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 rounded border border-gray-300 hover:bg-gray-50"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-medium text-sm">{item.quantity}</span>
                    <button
                      className="p-1.5 rounded border border-gray-300 hover:bg-gray-50"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item total */}
                  <div className="w-20 text-right font-semibold text-sm">₹{item.price * item.quantity}</div>

                  {/* Remove */}
                  <button
                    className="ml-2 p-1.5 rounded text-red-600 hover:bg-red-50"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Missed something CTA */}
              <div className="bg-white rounded-xl shadow p-4 border border-black">
                <div className="flex items-center justify-between">
                  <div className="text-gray-900 font-medium text-sm">Missed something <span className="text-gray-500">+ Add more items</span></div>
                  <Link to="/products" className="flex items-center text-green-700 hover:text-green-800 text-sm">
                    Explore <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* To pay summary */}
              <div className="bg-white rounded-xl shadow p-0 h-fit border border-black">
                <div className="px-4 py-3 flex items-center justify-between border-b border-black/10 rounded-t-xl bg-emerald-50">
                  <h2 className="text-base font-semibold flex items-center gap-2"><Receipt className="w-4 h-4 text-emerald-700" />
                    <span>To pay</span>
                  </h2>
                  {deliveryFee === 0 && subtotal > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Free delivery</span>
                  )}
                </div>
                <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-700 text-sm flex items-center gap-2"><Package className="w-4 h-4 text-gray-500" />
                    <span>Items total</span>
                  </span>
                  <span className="font-semibold text-sm">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-700 text-sm flex items-center gap-2"><Wrench className="w-4 h-4 text-gray-500" />
                    <span>Handling fee</span>
                  </span>
                  <span className="font-semibold text-sm">₹{handlingFee}</span>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-700 text-sm flex items-center gap-2"><Truck className="w-4 h-4 text-gray-500" />
                    <span>Delivery fee</span>
                  </span>
                  <span className="font-semibold text-sm">₹{deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-700 text-sm flex items-center gap-2"><Receipt className="w-4 h-4 text-gray-500" />
                    <span>GST</span>
                  </span>
                  <span className="font-semibold text-sm">₹{gst}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between mb-1.5 text-green-700">
                    <span className="text-sm flex items-center gap-2"><Ticket className="w-4 h-4 text-green-600" />
                      <span>Coupon discount</span>
                    </span>
                    <span className="font-semibold text-sm">-₹{discount}</span>
                  </div>
                )}
                <div className="border-t mt-2 pt-2 flex items-center justify-between text-base font-bold">
                  <span>Total to pay</span>
                  <span>₹{toPay}</span>
                </div>
                </div>
              </div>

              {/* Cancellation policy */}
              <div className="bg-white rounded-xl shadow p-4 text-sm text-gray-600 border border-black">
                Orders can be cancelled until they are packed for shipment. Refunds (if any) are issued to the original payment method.
              </div>

              {/* Address gate / payment (restored) */}
              {!hasAddress ? (
                <div className="bg-white rounded-lg shadow p-4 border border-black">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-900 font-medium">Add address to proceed</div>
                    <Link to="/addresses" className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700">Add Address</Link>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onPlaceOrder}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
                >
                  <Wallet className="w-4 h-4" /> Click to pay • ₹{toPay}
                </button>
              )}

              <button onClick={clearCart} className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-colors">
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
      {/* sticky footer removed */}
    </div>
  );
}
