import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import ImageComponent from "@/components/ImageComponent";

interface Gown {
  id: number;
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

export default function BuyGownDetails() {
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
  const [customSize, setCustomSize] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    if (id && session) {
      fetchGownDetails();
    }
  }, [id, session]);

  const fetchGownDetails = async () => {
    if (!session) return; // Ensure session is available
    try {
      const response = await fetch(`/api/gowns/${id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error fetching gown details: ${response.statusText}`);
      }
      const data = await response.json();
      setGown(data);
      setSelectedSize(data.size);
      setLoading(false);
    } catch (err) {
      setError("Failed to load gown details. Please try again.");
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (gown) {
      addToCart({
        id: `${gown.id}-${selectedSize}-${selectedDepartment}`, // Create a unique ID
        name: gown.name,
        size: selectedSize === "custom" ? customSize : selectedSize,
        price: gown.price,
        quantity: 1,
        department: selectedDepartment,
        image: selectedImage || gown.images?.[0]?.url || ""
      });

      // Show floating popup and auto-hide after 3 seconds
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 30000);
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
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6 relative">
      {/* Floating "Added to Cart" Popup */}
      {showAddedMessage && (
        <div className="fixed top-10 right-10 bg-white shadow-lg rounded-lg p-4 w-80 border border-gray-300 z-50">
          <div className="flex items-center space-x-4">
            <img
              src={selectedImage || gown?.images?.[0]?.url || ""}
              alt="Gown"
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold text-gray-900">Item Added to Cart</p>
              <p className="text-sm text-gray-600">{gown?.name}</p>
              <p className="text-sm text-gray-600">
                Size: {selectedSize === "custom" ? customSize : selectedSize}
              </p>
              <p className="text-sm text-gray-600">
                Department: {selectedDepartment}
              </p>
              <p className="text-sm text-gray-600">Price: ZMK {gown?.price}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => router.push("/cart")}
              className="text-blue-600 font-semibold"
            >
              View Cart
            </button>
            <button
              onClick={() => router.push("/checkout")}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

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
              ) : (
                gown.images?.[0]?.url && (
                  <ImageComponent
                    src={gown.images[0].url}
                    alt={gown.type}
                    className="w-96 h-96 object-cover rounded-md"
                  />
                )
              )}
              <div className="flex mt-4 space-x-2">
                {gown.images?.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 rounded-md cursor-pointer ${
                      selectedImage === image.url ? "border-4 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <ImageComponent
                      src={image.url || ""}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <h1 className="text-3xl font-bold text-[#01689c] mb-4">
                {gown.Institution.name}
              </h1>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {gown.type}
              </h2>
              <p className="text-gray-600">Price: ZMK{gown.price}</p>
              <p className="text-gray-600">
                {gown.inStock ? "In Stock" : "Out of Stock"}
              </p>
              <label htmlFor="size" className="block text-gray-600 mt-4">
                Select Size:
              </label>
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
                <option value="custom">Custom Size</option>
              </select>
              {selectedSize === "custom" && (
                <div className="mt-4">
                  <label htmlFor="customSize" className="block text-gray-600">
                    Enter Custom Size:
                  </label>
                  <input
                    type="text"
                    id="customSize"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    className="mt-2 p-2 border rounded-md"
                  />
                </div>
              )}
              <label htmlFor="department" className="block text-gray-600 mt-4">
                Select Department:
              </label>
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
                className="mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
