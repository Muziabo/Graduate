import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "../../../context/CartContext";

const HardCopyDetails: React.FC = () => {
  const router = useRouter();
  const { selectedImage, selectedCategory, productName } = router.query;

  const [selectedSize, setSelectedSize] = useState("");
  const [frameColor, setFrameColor] = useState("");
  const [frameThickness, setFrameThickness] = useState("");
  const [frameMaterial, setFrameMaterial] = useState("");
  const [frameColors, setFrameColors] = useState<string[]>([]);
  const [frameThicknesses, setFrameThicknesses] = useState<string[]>([]);
  const [frameMaterials, setFrameMaterials] = useState<string[]>([]);
  const [frameImages, setFrameImages] = useState<string[]>([]);
  const [selectedImageState, setSelectedImageState] = useState<string | null>(
    (selectedImage as string) || null
  );
  const [price, setPrice] = useState<number | null>(null);
  const [addFrame, setAddFrame] = useState(false);
  const [frameCost, setFrameCost] = useState<number>(0);

  useEffect(() => {
    const fetchFrameOptions = async () => {
      console.log("Fetching frame options..."); // Debugging log

      try {
        const response = await fetch("/api/frames/frame-options");
        if (!response.ok) throw new Error("Failed to fetch frame options");
        const data = await response.json();

        console.log("Frame API Response:", data); // Debugging log
        setFrameColors(data.frameColors || []);
        setFrameThicknesses(data.frameThicknesses || []);
        setFrameMaterials(data.frameMaterials || []);
        setFrameImages(data.frameImages || []);
        console.log("Frame Images:", data.frameImages); // Debugging log
      } catch (error) {
        console.error("Error fetching frame options:", error);
      }
    };
    fetchFrameOptions(); // Call the function to fetch frame options
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      if (typeof productName !== "string" || productName.trim() === "") {
        return;
      }
      try {
        const response = await fetch(
          `/api/photography/price?name=${encodeURIComponent(productName)}`
        );
        if (!response.ok) throw new Error("Failed to fetch price");
        const data = await response.json();

        setPrice(data.price);
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };
    fetchPrice();
  }, [productName]);

  const totalPrice = price !== null ? price + (addFrame ? frameCost : 0) : null;

  const { addToCart } = useCart();

  const handleSubmit = () => {
    const details = {
      selectedSize,
      frameColor: addFrame ? frameColor : null,
      frameThickness: addFrame ? frameThickness : null,
      frameMaterial: addFrame ? frameMaterial : null,
    };
    
    const itemId = `${productName}-${selectedSize}-${addFrame ? frameColor : 'no-frame'}`;
    
    addToCart({
      id: itemId,
      name: productName as string,
      size: selectedSize,
      price: price || 0,
      quantity: 1,
      frameColor: addFrame ? frameColor : undefined,
      frameMaterial: addFrame ? frameMaterial : undefined,
      frameThickness: addFrame ? frameThickness : undefined,
      image: selectedImageState || '',
    });
    router.push('/student/gowns');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-4 sm:p-8 flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 p-4">
          {selectedImageState ? (
            <div className="relative">
              <img
                src={selectedImageState}
                alt="Selected"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              {frameColor && (
                <div className="absolute inset-0 border-4 rounded-lg"
                  style={{ borderColor: frameColor }}
                ></div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No image selected</p>
          )}
        </div>

        <div className="w-full sm:w-1/2 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {selectedCategory || "Product Details"}
          </h1>
          <p className="text-sm text-gray-500 mb-4">Check out our reviews ⭐⭐⭐⭐⭐</p>
          <p className="text-gray-700 mb-4">
            Keep your certificate safe and display it proudly in one of our luxury frames.
          </p>

          <label className="block text-md font-semibold text-gray-700 mb-2">Photo Size</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="p-2 border rounded-md w-full mb-4"
          >
            <option value="">Select Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={addFrame}
                onChange={(e) => setAddFrame(e.target.checked)}
                className="form-checkbox bg-bg-cyan-950"
              />
              <span className="ml-2 text-gray-700">Add Frame</span>
            </label>
          </div>

          {addFrame && (
            <>
              <label className="block text-md font-semibold text-gray-700 mb-2">Frame Color</label>
              <select
                value={frameColor}
                onChange={(e) => setFrameColor(e.target.value)}
                className="p-2 border rounded-md w-full mb-4"
              >
                <option value="">Select Frame Color</option>
                {frameColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>

              <label className="block text-md font-semibold text-gray-700 mb-2">Frame Thickness</label>
              <select
                value={frameThickness}
                onChange={(e) => setFrameThickness(e.target.value)}
                className="p-2 border rounded-md w-full mb-4"
              >
                <option value="">Select Frame Thickness</option>
                {frameThicknesses.map((thickness) => (
                  <option key={thickness} value={thickness}>
                    {thickness}
                  </option>
                ))}
              </select>

              <label className="block text-md font-semibold text-gray-700 mb-2">Frame Material</label>
              <select
                value={frameMaterial}
                onChange={(e) => setFrameMaterial(e.target.value)}
                className="p-2 border rounded-md w-full mb-4"
              >
                <option value="">Select Frame Material</option>
                {frameMaterials.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>

              <div className="mt-4">
                <p className="text-gray-600 mb-2">Select Frame Style:</p>
                <div className="grid grid-cols-3 gap-2">
                  {frameImages.length > 0 ? (
                    frameImages.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImageState(image)}
                        className={`cursor-pointer border-2 rounded-lg ${
                          selectedImageState === image ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Frame ${index}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No frame images available</p>
                  )}
                </div>
              </div>
            </>
          )}

          <p className="text-lg text-gray-600 font-bold p-2 mb-2">
            ZMK {totalPrice !== null ? totalPrice : "Loading..."}
          </p>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full font-semibold px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default HardCopyDetails;
