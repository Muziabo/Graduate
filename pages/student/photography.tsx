"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCart } from "@/context/CartContext"; // Import the useCart hook

interface Photography {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images?: { url: string }[];
}

const PhotographyApp: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToCart } = useCart(); // Get the addToCart function from the cart context
  const [photographyServices, setPhotographyServices] = useState<Photography[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<'SOFT_COPY' | 'HARD_COPY' | null>(null);
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      fetchPhotographyServices();
    }
  }, [session]);

  const fetchPhotographyServices = async () => {
    try {
      const response = await fetch('/api/photography');
      if (!response.ok) throw new Error('Error fetching services');
      const data = await response.json();
      setPhotographyServices(data);
    } catch (err) {
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+[1-9]\d{1,14}$/.test(phone);

  const isFormValid = () => {
    if (orderType === 'SOFT_COPY') {
      return validateEmail(email) && validatePhone(whatsappNumber);
    }
    return orderType !== null;
  };

  const handleCategorySelect = (category: string, imageUrl: string, productName: string) => {
    setSelectedCategory(category);
    setSelectedImage(imageUrl);
    setSelectedProductName(productName);
    setOrderType(null);
  };

  const handleSoftCopyClick = () => setOrderType('SOFT_COPY');
  const handleHardCopyClick = () => {
    router.push({
      pathname: '/student/photography/hard-copy-details',
      query: { 
        selectedImage: selectedImage || '',
        productName: selectedProductName || ''
      },
    });
  };

  const handleAddToCart = () => {
    const orderData = {
      id: Date.now(), // Generate a unique ID for the cart item
      name: selectedProductName,
      image: selectedImage,
      price: orderType === 'SOFT_COPY' ? 100 : 200, // Example price, adjust as needed
      quantity: 1,
      size: orderType, // You can adjust this based on your requirements
    };

    addToCart(orderData); // Add the item to the cart
    alert('Item added to cart!'); // Notify the user
    router.push('/cart'); // Redirect to the cart page
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    setIsSubmitting(true);

    try {
      // Instead of submitting, add to cart
      handleAddToCart();
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold text-gray-700 animate-pulse">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold text-gray-700 animate-pulse">
        Redirecting...
      </div>
    );
  }

  const photographyCategories = [
    { name: 'Individual Portraits', category: 'PORTRAIT' },
    { name: 'Group Photos', category: 'GROUP' },
    { name: 'Candid Moments', category: 'CANDID' },
    { name: 'Cap and Gown Photos', category: 'EVENT' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
      {!selectedCategory ? (
        <>
          <h1 className="text-4xl font-bold text-[#01689c] mb-6 text-center">
            {session.user.institutionName} Photography
          </h1>
          <p className="text-gray-600 mb-8 text-center text-lg max-w-2xl">
            Select your preferred photography package for the graduation event.
            Choose from our curated collection of professional shots.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            {photographyCategories.map((categoryItem) => {
              const filteredServices = photographyServices.filter(
                service => service.category === categoryItem.category
              );
              
              return (
                <div
                  key={categoryItem.category}
                  className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-500"
                  onClick={() => {
                    if (filteredServices[0]?.images?.[0]?.url) {
                      handleCategorySelect(
                        categoryItem.name,
                        filteredServices[0].images[0].url,
                        filteredServices[0].name
                      );
                    }
                  }}
                >
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-xl" />
                      <div className="h-4 bg-gray-200 rounded mt-4 w-3/4" />
                    </div>
                  ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                  ) : filteredServices.length > 0 ? (
                    <>
                      <div className="relative aspect-square overflow-hidden rounded-xl">
                        <img
                          src={filteredServices[0]?.images?.[0]?.url || '/placeholder.jpg'}
                          alt={categoryItem.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mt-4 text-center">
                        {categoryItem.name}
                      </h3>
                    </>
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      No {categoryItem.name} available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="w-full max-w-4xl">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Categories
            </button>

            <h1 className="text-4xl font-bold text-[#01689c] mb-2 text-center">
              {selectedCategory} Photography
            </h1>
            <p className="text-gray-600 mb-8 text-center text-lg">
              Selected Package: {selectedProductName}
            </p>

            <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-lg mb-8">
              <img
                src={selectedImage || '/placeholder-image.jpg'}
                alt={selectedCategory}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                className={`flex-1 flex items-center justify-center px-8 py-4 rounded-xl transition-all ${
                  orderType === 'SOFT_COPY'
                    ? 'bg-blue-600 shadow-lg text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                onClick={handleSoftCopyClick}
              >
                <svg
                  className={`w-6 h-6 mr-2 ${orderType === 'SOFT_COPY' ? 'text-white' : 'text-gray-500'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Digital Delivery
              </button>

              <button
                className={`flex-1 flex items-center justify-center px-8 py-4 rounded-xl transition-all ${
                  orderType === 'HARD_COPY'
                    ? 'bg-green-600 shadow-lg text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                onClick={handleHardCopyClick}
              >
                <svg
                  className={`w-6 h-6 mr-2 ${orderType === 'HARD_COPY' ? 'text-white' : 'text-gray-500'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Physical Delivery
              </button>
            </div>

            {orderType === 'SOFT_COPY' && (
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    pattern="^\+[1-9]\d{1,14}$"
                    required
                  />
                </div>
              </div>
            )}

            {orderType === 'SOFT_COPY' && (
              <button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className={`mt-8 px-10 py-4 text-lg font-medium rounded-lg transition-all ${
                  isFormValid()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 shadow-lg'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Add to Cart'
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PhotographyApp;