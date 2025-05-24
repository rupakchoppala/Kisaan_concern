import React, { useEffect, useState } from 'react';
import { FiShoppingCart, FiTag, FiBox } from 'react-icons/fi';
import { GiFertilizerBag } from 'react-icons/gi';
import { FaLeaf } from 'react-icons/fa';
import Layout from '../layouts/layout';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
const categories = ['all', 'fertilizer', 'pesticide', 'herbicide', 'fungicide'];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
   const navigate=useNavigate();
  const Fetchfertilzers=async()=>{
    try{
      const res=await axiosInstance.get('/api/pesti/all_fertilizers');
      const data=res.data;
      setProducts(data);
      setFiltered(data);

    }
    catch(err){
    console.error('Error fetching the fertilizers',err);
    }
  }
  useEffect(() => {
    // fetch('http://127.0.0.1:5000/api/pesti/all_fertilizers')
    // fetch('/all_fertilizers_data.json')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setProducts(data);
    //     setFiltered(data);
    //   })
    //   .catch((err) => console.error('Fetch Error:', err));
    Fetchfertilzers();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFiltered(products);
    } else {
      const result = products.filter((p) => p.category?.toLowerCase() === category);
      setFiltered(result);
    }
    setIsMenuOpen(false);
  };
  const handleAddCart = async (productId) => {
    try {
      const res = await axiosInstance.post('/api/cart/ferti_add', {
        productId,
        quantity: 1, // default quantity, adjust if needed
      });
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };
  
  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* Centered Dropdown */}
      <div className="relative flex justify-center mb-10">
        <div className="relative inline-block text-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-green-600 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
          >
            <FaLeaf className="inline mr-2" />
            Browse Categories
          </button>

          {isMenuOpen && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-60 bg-white shadow-2xl border border-green-200 rounded-2xl z-50 animate-fade-in-down">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilter(cat)}
                  className={`w-full px-5 py-3 text-left flex items-center gap-3 rounded-xl hover:bg-green-100 transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-green-200 font-bold text-green-800'
                      : 'text-gray-700'
                  }`}
                >
                  <GiFertilizerBag className="text-green-600" />
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Category Label */}
      <div>
        <h3 className="text-4xl font-semibold text-green-900 text-center mb-8 capitalize">
          {activeCategory}
        </h3>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {filtered?.map((product, index) => (
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
                <button className="w-1/2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                onClick={()=>handleAddCart(product._id)}>
                  <FiShoppingCart className="inline mr-1" />Add to Cart
                </button>
              </div>
              <div className="mt-5 flex gap-2">
                <button className="w-full bg-orange-400 text-white py-2 rounded-xl hover:bg-yellow-600 transition"
                onClick={()=>navigate(`/fertilizer/${product._id}`)}>
                  Explore
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default ProductList;
