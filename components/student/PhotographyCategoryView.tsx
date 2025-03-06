import { FC } from 'react';

interface PhotographyCategoryViewProps {
  selectedCategory: string;
  selectedImage: string;
  orderType: 'SOFT_COPY' | 'HARD_COPY';
  email: string;
  whatsappNumber: string;
  handleSoftCopyClick: () => void;
  handleHardCopyClick: () => void;
  handleSubmit: () => void;
  setEmail: (value: string) => void;
  setWhatsappNumber: (value: string) => void;
}

export const PhotographyCategoryView: FC<PhotographyCategoryViewProps> = ({
  selectedCategory,
  selectedImage,
  orderType,
  email,
  whatsappNumber,
  handleSoftCopyClick,
  handleHardCopyClick,
  handleSubmit,
  setEmail,
  setWhatsappNumber,
}) => {
  return (
    <>
      <h1 className="text-4xl font-bold text-[#01689c] mb-6">
        {selectedCategory} Photography
      </h1>
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
  );
};
