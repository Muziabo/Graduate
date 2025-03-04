'use client'

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ImageComponent from "@/components/ImageComponent";
import { useCart } from "@/context/CartContext";

interface Gown {
  id: string;
  name: string;
  size: string;
  price: number;
  inStock: boolean;
  type: string;
  category: string;
  images?: { url: string }[];
  Institution: {
    name: string;
  };
  availableSizes?: { size: string; stock: number }[];
}

export default function HireGownDetails() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  const departments = [
    "School of Sciences",
    "School of Engineering & Technology",
    "School of Education",
    "School of Medicine & Health Sciences",
    "School of Business & Economics",
    "School of Arts & Humanities"
  ];

  const [gown, setGown] = useState<Gown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    if (id && session) {
      fetchGownDetails();
    }
  }, [id, session]);

  const fetchGownDetails = async () => {
    if (!session) return;
    try {
      const response = await fetch(`/api/gowns/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching gown details: ${response.statusText}`);
      }
      const data = await response.json();
      setGown(data);
      setSelectedSize(data.size);
      setSelectedImage(data.images?.[0]?.url || null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gown details:", error);
      setError("Failed to load gown details. Please try again.");
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedDepartment) {
      alert("Please select a department");
      return;
    }

    if (gown) {
      addToCart({
        name: gown.name,
        size: selectedSize,
        price: gown.price,
        quantity: 1,
        department: selectedDepartment,
        image: selectedImage || gown.images?.[0]?.url || ''
      });

      alert(`Added to cart! Size: ${selectedSize}, Department: ${selectedDepartment}`);
      router.push('/student/photography');
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Redirecting...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-lg font-medium text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      {gown && (
        <div className="max-w-4xl w-full bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0">
              {selectedImage ? (
                <ImageComponent
                  src={selectedImage}
                  alt={gown.type}
                  className="w-96 h-96 object-cover rounded-md"
                />
              ) : gown.images?.[0]?.url && (
                <ImageComponent
                  src={gown.images[0].url}
                  alt={gown.type}
                  className="w-96 h-96 object-cover rounded-md"
                />
              )}

              <div className="flex mt-4 space-x-2">
                {gown.images?.slice(0, 4).map((image, index) => (
                  <div 
                    key={index}
                    className={`w-20 h-20 rounded-md cursor-pointer ${selectedImage === image.url ? 'border-4 border-blue-500' : ''}`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <ImageComponent
                      src={image.url || ''}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <h1 className="text-3xl font-bold text-[#01689c] mb-4">{gown.Institution.name}</h1>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{gown.type}</h2>
              <p className="text-gray-600">Price: ZMK{gown.price}</p>
              <p className="text-gray-600">{gown.inStock ? 'In Stock' : 'Out of Stock'}</p>
              <label htmlFor="size" className="block text-gray-600 mt-4">Select Size:</label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="mt-2 p-2 border rounded-md"
              >
                {gown.availableSizes ? (
                  gown.availableSizes.map(({ size, stock }) => (
                    <option key={size} value={size}>
                      {size} (In Stock: {stock})
                    </option>
                  ))
                ) : (
                  <option value={gown.size}>{gown.size}</option>
                )}
              </select>
              <label htmlFor="department" className="block text-gray-600 mt-4">Select Department:</label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="mt-2 p-2 border rounded-md"
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <br />
              <button
                onClick={handleAddToCart}
                disabled={!selectedDepartment || !gown.inStock}
                className={`mt-4 px-4 py-2 rounded-md ${
                  !selectedDepartment || !gown.inStock
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-900 hover:bg-blue-600'
                } text-white`}
              >
                {!gown.inStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
