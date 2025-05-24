import React, { useEffect, useState } from 'react';
import { FiShoppingCart, FiTag, FiBox } from 'react-icons/fi';
const RecomFertilizers = ({ filterNames = [] }) => {
  const [allFertilizers, setAllFertilizers] = useState([]);
  const [filteredFertilizers, setFilteredFertilizers] = useState([]);
  // console.log("nmae",filterNames);
  useEffect(() => {
    fetch('/all_fertilizers_data.json')
      .then((res) => res.json())
      .then((data) => {
        setAllFertilizers(data);
      })
      .catch((err) => console.error('Fetch Error:', err));
  }, []);
 // console.log(allFertilizers);
 const stopwords = ['fertilizer', 'fertiliser', 'manure', 'or', 'and', 'the', 'with', 'of','access','avoid'];
 useEffect(() => {
  if (Array.isArray(filterNames) && filterNames.length > 0 && allFertilizers.length > 0) {
    // Extract keywords from filter names
    const keywords = filterNames.flatMap(name =>
      name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '') // Remove special characters
        .split(/\s+/) // Split into individual words
        .filter(word => word.length > 2 && !stopwords.includes(word)) // Remove stopwords
    );

    const filtered = allFertilizers.filter(fertilizer => {
      const fertilizerName = fertilizer.name.toLowerCase();
      return keywords.some(keyword => fertilizerName.includes(keyword));
    });

    console.log("Filtered fertilizers:", filtered);
    setFilteredFertilizers(filtered);
  } else {
    setFilteredFertilizers([]);
  }
}, [filterNames, allFertilizers]);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
    {filteredFertilizers.map((product, index) => (
      <div
        key={index}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-green-200 flex flex-col"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain p-4"
        />
        <div className="px-4 py-3 flex-1 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-green-800 flex items-center gap-2 mb-1">
              <FiBox className="text-green-500" /> {product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
          </div>
          <div className="mt-4 space-y-1 flex gap-4">
            <div>
              <p className="text-green-700 font-semibold flex items-center gap-1">
                ₹ {product.sale_price || 'N/A'}
              </p>
              {product.discount && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <FiTag /> {product.discount} OFF
                </p>
              )}
            </div>
            <button className="w-1/2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
              <FiShoppingCart className="inline mr-1" /> Cart
            </button>
          </div>
          <div className="mt-5 flex gap-2">
            <button className="w-full bg-orange-400 text-white py-2 rounded-xl hover:bg-yellow-600 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
  );
};

export default RecomFertilizers;
