'use client'

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
  const [selectedImageState, setSelectedImageState] = useState<string>(
    (selectedImage as string) || '/images/frame.png'
  );
  const [price, setPrice] = useState<number | null>(null);
  const [addFrame, setAddFrame] = useState(false);
  const [frameCost] = useState<number>(0);

  const defaultImage = '/images/frame.png';
  const userSelectedImage = (selectedImage as string) || defaultImage;

  useEffect(() => {
    const fetchFrameOptions = async () => {
      try {
        const response = await fetch("/api/frames/frame-options");
        if (!response.ok) throw new Error("Failed to fetch frame options");
        const data = await response.json();

        setFrameColors(data.frameColors || []);
        setFrameThicknesses(data.frameThicknesses || []);
        setFrameMaterials(data.frameMaterials || []);
        setFrameImages((data.frameImages || []).slice(0, 4));
      } catch (error) {
        console.error("Error fetching frame options:", error);
      }
    };
    fetchFrameOptions();
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
      image: addFrame ? selectedImageState : userSelectedImage
    });
    router.push('/cart');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-4 sm:p-8 flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 p-4">
          {/* Main Image Display */}
          <div className="relative w-full aspect-[3/4] shadow-xl rounded-lg overflow-hidden">
            {addFrame ? (
              <>
                {/* Frame image as background */}
                <img
                  src={selectedImageState}
                  alt="Frame"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Selected photo inside the frame */}
                <div className="absolute inset-[10%] bg-white rounded-lg shadow-inner overflow-hidden">
                  <img
                    src={userSelectedImage}
                    alt="Selected Photo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </>
            ) : (
              // Just show the selected photo without frame
              <img
                src={userSelectedImage}
                alt="Selected Photo"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        <div className="w-full sm:w-1/2 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {selectedCategory || "Product Details"}
          </h1>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">⭐⭐⭐⭐⭐ Trusted by thousands of graduates</p>
            <p className="text-gray-700">
              Keep your memories safe and display them proudly with our premium frames.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-md font-semibold text-gray-700 mb-2">Photo Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addFrame}
                  onChange={(e) => setAddFrame(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Add Premium Frame (+K{frameCost})</span>
              </label>
            </div>

            {addFrame && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">Frame Color</label>
                  <select
                    value={frameColor}
                    onChange={(e) => setFrameColor(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Frame Color</option>
                    {frameColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">Frame Thickness</label>
                  <select
                    value={frameThickness}
                    onChange={(e) => setFrameThickness(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Frame Thickness</option>
                    {frameThicknesses.map((thickness) => (
                      <option key={thickness} value={thickness}>
                        {thickness}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">Frame Material</label>
                  <select
                    value={frameMaterial}
                    onChange={(e) => setFrameMaterial(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Frame Material</option>
                    {frameMaterials.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-md font-semibold text-gray-700 mb-3">Frame Style</p>
                  <div className="grid grid-cols-2 gap-4">
                    {frameImages.length > 0 ? (
                      frameImages.map((frameImage, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedImageState(frameImage)}
                          className={`group cursor-pointer relative rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                            selectedImageState === frameImage 
                              ? 'ring-2 ring-blue-500 shadow-lg' 
                              : 'hover:shadow-lg'
                          }`}
                        >
                          <div className="relative aspect-[3/4]">
                            <img
                              src={frameImage}
                              alt={`Frame ${index + 1}`}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-[15%] bg-white rounded shadow-inner overflow-hidden">
                              <img
                                src={userSelectedImage}
                                alt="Selected Photo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center col-span-2">No frame styles available</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-xl font-bold text-gray-800">
              Total: ZMK {totalPrice !== null ? totalPrice.toFixed(2) : "Loading..."}
            </p>

            <button
              onClick={handleSubmit}
              disabled={!selectedSize || (addFrame && (!frameColor || !frameThickness || !frameMaterial))}
              className={`w-full py-4 px-6 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                !selectedSize || (addFrame && (!frameColor || !frameThickness || !frameMaterial))
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardCopyDetails;
