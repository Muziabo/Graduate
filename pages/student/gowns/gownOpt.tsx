import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ImageComponent from "@/components/ImageComponent";

interface Gown {
  id: number;
  name: string;
  size: string;
  price: number;
  inStock: boolean;
  type: string;
  images?: { url: string }[];
  orders?: Order[];
}

interface Order {
  id: number;
  gownId: number;
  status: string;
  type: string;
}

export default function GownOpt() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { type } = router.query;

  const [gowns, setGowns] = useState<Gown[]>([]);
  const [loadingGowns, setLoadingGowns] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      fetchGown();
    }
  }, [session, router.query]);


  const fetchGown = async () => {
    const { id } = router.query;
    if (!id) return;

    try {
      const response = await fetch(`/api/gowns/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching gown: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched gown data:', data); // Add debug log
      setGowns([data]);
      setLoadingGowns(false);
    } catch (err) {
      console.error('Error fetching gown:', err); // Add error log
      setError("Failed to load gown. Please try again.");
      setLoadingGowns(false);
    }
  };



  if (status === "loading") {
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

  // Display gown details regardless of orders
  const gownToDisplay = gowns[0];



  const handleHireClick = (id: number) => {
    router.push({
      pathname: '/student/gowns/hire',
      query: { id, type }
    });
  };

  const handleBuyClick = (id: number) => {
    router.push({
      pathname: '/student/gowns/buy',
      query: { id, type }
    });
  };


  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <div className="max-w-3xl w-full bg-white shadow-sm rounded-lg p-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#01689c] mb-4">
          {session?.user?.institution}
        </h1>
        <hr className="my-4" />
        <p className="mt-4 text-gray-600">
          <span className="font-semibold">Select Your Package:</span>
        </p>
        <p className="mt-4 text-gray-600">
          Select your gown package for the graduation event, taking place on 21st March 2025. All items will be delivered to your chosen delivery address in advance of the event.
        </p>
      </div>

      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className="bg-white shadow-md rounded-md p-4 flex flex-col items-start cursor-pointer" 
          onClick={() => handleHireClick(gownToDisplay.id)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">HIRE</h3>
          {loadingGowns ? (
            <p className="text-gray-600">Loading gowns...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="text-gray-600 space-y-2 text-center w-full">
              <ImageComponent
                src={gownToDisplay.images?.[0]?.url || ''}
                alt="Hire Gown"
                className="w-full h-auto object-cover rounded-sm"
              />
              <p className="text-lg font-semibold">{type}</p>
              <hr className="my-2 w-16 mx-auto border-t-4 border-orange-300" />
              <p className="text-md font-semibold">ZMW {gownToDisplay.price}</p>
            </div>
          )}
        </div>

        <div 
          className="bg-white shadow-md rounded-md p-4 flex flex-col items-start cursor-pointer" 
          onClick={() => handleBuyClick(gownToDisplay.id)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">BUY</h3>
          {loadingGowns ? (
            <p className="text-gray-600">Loading gowns...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="text-gray-600 space-y-2 text-center w-full">
              <ImageComponent
                src={gownToDisplay.images?.[0]?.url || ''}
                alt="Buy Gown"
                className="w-full h-auto object-cover rounded-sm"
              />
              <p className="text-lg font-semibold">{type}</p>
              <hr className="my-2 w-16 mx-auto border-t-4 border-orange-300" />
              <p className="text-md font-semibold">ZMW {gownToDisplay.price}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
