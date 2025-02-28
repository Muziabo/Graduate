"use client";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import ErrorBoundary from "../../components/ErrorBoundary";

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image?: string; // Add image property
}

const provinces = [
  "Central",
  "Copperbelt",
  "Eastern",
  "Luapula",
  "Lusaka",
  "Muchinga",
  "Northern",
  "North-Western",
  "Southern",
  "Western"
];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [province, setProvince] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!postcode.trim()) newErrors.postcode = "Postcode is required";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (!province) newErrors.province = "Province is required";
    
    if (!cardNumber.match(/^\d{16}$/)) newErrors.cardNumber = "Invalid card number";
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) newErrors.expiryDate = "Invalid expiry date";
    if (!cvv.match(/^\d{3,4}$/)) newErrors.cvv = "Invalid CVV";
    if (!cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Simulate async checkout process
      await new Promise(resolve => setTimeout(resolve, 1000));
      clearCart();
      if (formRef.current) formRef.current.reset();
      setErrors({});
      alert("Checkout successful!");
    } catch (error) {
      alert("Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex justify-center">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="overflow-y-auto no-scrollbar">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="province" className="block text-gray-700 font-medium mb-2">Province</label>
              <select
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.province ? "border-red-500" : ""}`}
                aria-invalid={!!errors.province}
                aria-describedby="province-error"
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p id="province-error" className="text-red-500 text-sm mt-1">{errors.province}</p>
              )}
            </div>
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First name (optional)</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.lastName ? "border-red-500" : ""}`}
                aria-invalid={!!errors.lastName}
                aria-describedby="lastName-error"
                required
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.address ? "border-red-500" : ""}`}
                aria-invalid={!!errors.address}
                aria-describedby="address-error"
                required
              />
              {errors.address && (
                <p id="address-error" className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <label htmlFor="apartment" className="block text-gray-700 font-medium mb-2">Apartment, suite, etc. (optional)</label>
              <input
                type="text"
                id="apartment"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.city ? "border-red-500" : ""}`}
                aria-invalid={!!errors.city}
                aria-describedby="city-error"
                required
              />
              {errors.city && (
                <p id="city-error" className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label htmlFor="postcode" className="block text-gray-700 font-medium mb-2">Postcode</label>
              <input
                type="text"
                id="postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.postcode ? "border-red-500" : ""}`}
                aria-invalid={!!errors.postcode}
                aria-describedby="postcode-error"
                required
              />
              {errors.postcode && (
                <p id="postcode-error" className="text-red-500 text-sm mt-1">{errors.postcode}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.phone ? "border-red-500" : ""}`}
                aria-invalid={!!errors.phone}
                aria-describedby="phone-error"
                required
              />
              {errors.phone && (
                <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Shipping method</h3>
          <p className="text-gray-700">Enter your shipping address to view available shipping methods.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-6">Payment</h2>
          <div className="border p-4 rounded-lg shadow-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="payment" defaultChecked className="form-radio text-indigo-600" />
              <span className="font-medium text-gray-700">Credit Card</span>
            </label>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                id="cardNumber"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className={`w-full p-3 border rounded-md ${errors.cardNumber ? "border-red-500" : ""}`}
                aria-invalid={!!errors.cardNumber}
                aria-describedby="cardNumber-error"
                maxLength={16}
              />
              {errors.cardNumber && (
                <p id="cardNumber-error" className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}

              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={`w-1/2 p-3 border rounded-md ${errors.expiryDate ? "border-red-500" : ""}`}
                  aria-invalid={!!errors.expiryDate}
                  aria-describedby="expiryDate-error"
                  maxLength={5}
                />
                <input
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className={`w-1/2 p-3 border rounded-md ${errors.cvv ? "border-red-500" : ""}`}
                  aria-invalid={!!errors.cvv}
                  aria-describedby="cvv-error"
                  maxLength={4}
                />
                {errors.expiryDate && (
                  <p id="expiryDate-error" className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                )}
                {errors.cvv && (
                  <p id="cvv-error" className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>

              <input
                type="text"
                id="cardholderName"
                placeholder="Name on Card"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className={`w-full p-3 border rounded-md ${errors.cardholderName ? "border-red-500" : ""}`}
                aria-invalid={!!errors.cardholderName}
                aria-describedby="cardholderName-error"
              />
              {errors.cardholderName && (
                <p id="cardholderName-error" className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
              )}
            </div>
            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-indigo-600" defaultChecked />
                <span className="text-gray-700">Use shipping address as billing address</span>
              </label>
            </div>
          </div>
          <button
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            onClick={handleCheckout}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              "Pay Now"
            )}
          </button>
        </div>

        {/* Order Summary */}
        <div className="h-fit">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            {cart.map((item: CartItem) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <span className="text-sm text-gray-500">Size: {item.size} × {item.quantity}</span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">K{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total:</span>
              <span>K{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}