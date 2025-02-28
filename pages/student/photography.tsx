import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

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
  const [photographyServices, setPhotographyServices] = useState<Photography[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // New state to store the selected product name
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<'SOFT_COPY' | 'HARD_COPY' | null>(null);
  const [contactDetails, setContactDetails] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    if (session) {
      fetchPhotographyServices();
    }
  }, [session]);

  const fetchPhotographyServices = async () => {
    try {
      const response = await fetch('/api/photography');
      if (!response.ok) {
        throw new Error('Error fetching photography services');
      }
      const data = await response.json();
      setPhotographyServices(data);
    } catch (err) {
      setError('Failed to load photography services. Please try again.');
    } finally {
      setLoading(false);
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

  // Update handler to also capture the product name from the first service in the filtered list
  const handleCategorySelect = (category: string, imageUrl: string, productName: string) => {
    setSelectedCategory(category);
    setSelectedImage(imageUrl);
    setSelectedProductName(productName);
    setOrderType(null); // Reset order type when a new category is selected
  };

  const handleSoftCopyClick = () => {
    setOrderType('SOFT_COPY');
  };

  // Pass both selectedImage and selectedProductName in the query parameters
  const handleHardCopyClick = () => {
    setOrderType('HARD_COPY');
    router.push({
      pathname: '/student/photography/hard-copy-details',
      query: { 
        selectedImage: selectedImage || '',
        productName: selectedProductName || ''
      },
    });
  };

  const handleSubmit = async () => {
    const orderData = {
      category: selectedCategory,
      imageUrl: selectedImage,
      orderType,
      contactDetails,
      email,
      whatsappNumber,
    };
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        alert('Your order has been placed successfully!');
      } else {
        throw new Error('Order submission failed');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      {!selectedCategory ? (
        <>
          <h1 className="text-5xl font-extrabold text-[#01689c] mb-6">{session.user.institution}</h1>
          <p className="text-gray-700 mb-8 text-lg">
            Select your photography package for the graduation event.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photographyCategories.map((categoryItem) => {
              const filteredServices = photographyServices.filter(
                service => service.category === categoryItem.category
              );
              return (
                <div
                  key={categoryItem.category}
                  className="bg-white shadow-xl rounded-xl p-6 cursor-pointer hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 hover:border-blue-500"
                  onClick={() => {
                    if (filteredServices[0]?.images?.[0]?.url) {
                      // Pass the image URL and also the product name from the first matching service
                      handleCategorySelect(
                        categoryItem.name,
                        filteredServices[0].images[0].url,
                        filteredServices[0].name
                      );
                    }
                  }}
                >
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : filteredServices.length > 0 && filteredServices[0]?.images?.length > 0 ? (
                    <>
                      <img
                        src={filteredServices[0].images[0].url}
                        alt={categoryItem.name}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <h3 className="text-xl font-semibold text-gray-800 mt-4 text-center">
                        {categoryItem.name}
                      </h3>
                    </>
                  ) : (
                    <p>No {categoryItem.name} services found.</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
  <h1 className="text-4xl font-bold text-[#01689c] mb-6">{selectedCategory} Photography</h1>
  <img
    src={selectedImage || ''}
    alt={selectedCategory || 'Selected'}
    className="w-full max-w-lg h-64 object-cover rounded-xl shadow-lg"
  />
  <div className="mt-6 flex space-x-4">
    <button
      className={`px-6 py-3 rounded-lg text-white ${
        orderType === 'SOFT_COPY' ? 'bg-blue-600' : 'bg-gray-400'
      } transition-all hover:scale-105`}
      onClick={handleSoftCopyClick}
    >
      Soft Copy
    </button>
    <button
      className={`px-6 py-3 rounded-lg text-white ${
        orderType === 'HARD_COPY' ? 'bg-green-600' : 'bg-gray-400'
      } transition-all hover:scale-105`}
      onClick={handleHardCopyClick}
    >
      Hard Copy
    </button>
  </div>
  {orderType === 'SOFT_COPY' && (
    <div className="mt-4 w-full max-w-lg">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-4 p-2 border rounded-md w-full"
      />
      <input
        type="text"
        placeholder="Enter your WhatsApp number"
        value={whatsappNumber}
        onChange={(e) => setWhatsappNumber(e.target.value)}
        className="mt-4 p-2 border rounded-md w-full"
      />
    </div>
  )}
  <button
    onClick={handleSubmit}
    className="mt-6 px-8 py-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
  >
    Submit Order
  </button>
</>
      )}
    </div>
  );
};

export default PhotographyApp;
