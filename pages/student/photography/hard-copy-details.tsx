"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";

const HardCopyDetails: React.FC = () => {
  const router = useRouter();
  const { selectedImage, selectedCategory, productName } = router.query;

  const [selectedSize, setSelectedSize] = useState("");
  const [frameColor] = useState("");
  const [frameThickness, setFrameThickness] = useState("");
  const [frameMaterial, setFrameMaterial] = useState("");
  const [setFrameColors] = useState<string[]>([]);
  const [frameThicknesses, setFrameThicknesses] = useState<string[]>([]);
  const [frameMaterials, setFrameMaterials] = useState<string[]>([]);
  const [frameImages, setFrameImages] = useState<string[]>([]);
  const [selectedImageState, setSelectedImageState] = useState<string>(
    (selectedImage as string) || "/images/frame.png"
  );
  const [price, setPrice] = useState<number | null>(null);
  const [addFrame, setAddFrame] = useState(false);
  const [frameCost] = useState<number>(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const defaultImage = "/images/frame.png";
  const userSelectedImage = (selectedImage as string) || defaultImage;

  useEffect(() => {
    const fetchFrameOptions = async () => {
      try {
        const response = await fetch("/api/frames/frame-options");
        if (!response.ok) throw new Error("Failed to fetch frame options");
        const data = await response.json();

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

  const totalPrice =
    price !== null ? price + (addFrame ? frameCost : 0) : null;

  const { addToCart } = useCart();

  const handleSubmit = () => {
    const itemId = `${productName}-${selectedSize}-${
      addFrame ? frameColor : "no-frame"
    }`;

    addToCart({
      id: itemId,
      name: productName as string,
      size: selectedSize,
      price: price || 0,
      quantity: 1,
      frameColor: addFrame ? frameColor : undefined,
      frameMaterial: addFrame ? frameMaterial : undefined,
      frameThickness: addFrame ? frameThickness : undefined,
      image: addFrame ? selectedImageState : userSelectedImage,
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8 relative">
      {/* Floating "Added to Cart" Popup */}
      {showAddedMessage && (
        <div className="fixed top-10 right-10 bg-white shadow-lg rounded-lg p-4 w-80 border border-gray-300 z-50">
          <div className="flex items-center space-x-4">
            <img
              src={addFrame ? selectedImageState : userSelectedImage}
              alt="Product"
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold text-gray-900">Item Added to Cart</p>
              <p className="text-sm text-gray-600">{productName}</p>
              <p className="text-sm text-gray-600">Size: {selectedSize}</p>
              <p className="text-sm text-gray-600">
                Price: ZMK {price?.toFixed(2)}
              </p>
              {addFrame && frameColor && (
                <p className="text-sm text-gray-600">Frame: {frameColor}</p>
              )}
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

      <div className="max-w-7xl w-full bg-white shadow-lg rounded-lg p-3 sm:p-6 flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 p-3 flex">
          {addFrame && (
            <div className="flex flex-col space-y-1 mr-2">
              <p className="text-sm font-semibold text-gray-700 mb-2">Frame Style</p>
              <div className="grid grid-cols-1 gap-3">
                {frameImages.length > 0 ? (
                  frameImages.map((frameImage, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageState(frameImage)}
                      className={`group cursor-pointer relative rounded-lg overflow-hidden transition-transform transform hover:scale-105 ${
                        selectedImageState === frameImage ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-lg"
                      }`}
                    >
                      <div className="relative aspect-[3/4]">
                        <img src={frameImage} alt={`Frame ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-[10%] bg-white rounded shadow-inner overflow-hidden">
                          <img src={userSelectedImage} alt="Selected Photo" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No frame styles available</p>
                )}
              </div>
            </div>
          )}
          <div className="relative w-full aspect-[3/4] shadow-md rounded-lg overflow-hidden">
            {addFrame ? (
              <>
                <img src={selectedImageState} alt="Frame" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-[10%] bg-white rounded shadow-inner overflow-hidden">
                  <img src={userSelectedImage} alt="Selected Photo" className="w-full h-full object-contain" />
                </div>
              </>
            ) : (
              <img src={userSelectedImage} alt="Selected Photo" className="w-full h-full object-contain" />
            )}
          </div>
        </div>
        <div className="w-full sm:w-1/2 p-3 sm:p-5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">{selectedCategory || "Product Details"}</h1>
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-xs text-gray-600 mb-1">⭐⭐⭐⭐⭐ Trusted by thousands of graduates</p>
            <p className="text-gray-700 text-sm">Keep your memories safe with our premium frames.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Photo Size</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className=" w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={addFrame} onChange={(e) => setAddFrame(e.target.checked)} className="form-checkbox h-4 w-4 text-blue-600" />
                <span className="text-gray-700 text-sm font-medium">Add Premium Frame (+K{frameCost})</span>
              </label>
            </div>
            {addFrame && (
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Frame Material</label>
                  <select value={frameMaterial} onChange={(e) => setFrameMaterial(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Frame Material</option>
                    {frameMaterials.map((material) => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Frame Thickness</label>
                  <select value={frameThickness} onChange={(e) => setFrameThickness(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Frame Thickness</option>
                    {frameThicknesses.map((thickness) => (
                      <option key={thickness} value={thickness}>{thickness}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-3">
            <p className="text-lg font-bold text-gray-800">Total: ZMK {totalPrice !== null ? totalPrice.toFixed(2) : "Loading..."}</p>
            <button onClick={handleSubmit} disabled={!selectedSize || (addFrame && (!frameColor || !frameThickness))} className={`w-full py-3 px-5 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 ${!selectedSize || (addFrame && (!frameColor || !frameThickness)) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"}`}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardCopyDetails;