import { useState, useEffect } from "react";
import { FaLeaf, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Layout from "../layouts/layout";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrganic, setFilterOrganic] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate=useNavigate();
   const fetchProducts=async()=>{
    const res=await axiosInstance.get('/api/products/all_products');
    const data=res.data;
    setProducts(data)
   }
  useEffect(() => {

    // const data = [
    //   {
    //     id: 1,
    //     name: "Organic Tomatoes",
    //     price: 50,
    //     quantity: "1 kg",
    //     description: "Fresh organic tomatoes from Andhra Pradesh.",
    //     image: "/images/tomatoes.jpg",
    //     sellerName: "Raju Farmer",
    //     location: "Andhra Pradesh",
    //     isOrganic: true,
    //     rating: 4.5,
    //   },
    //   {
    //     id: 2,
    //     name: "Non-Organic Potatoes",
    //     price: 30,
    //     quantity: "1 kg",
    //     description: "Locally grown potatoes.",
    //     image: "/images/potatoes.jpg",
    //     sellerName: "Sita Farmer",
    //     location: "Telangana",
    //     isOrganic: false,
    //     rating: 4.2,
    //   },
    //   // Add more data
    // ];
   // setProducts(data);
   fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.sellerName?.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrganic =
      filterOrganic === "all" ||
      (filterOrganic === "organic" && product.isOrganic) ||
      (filterOrganic === "non-organic" && !product.isOrganic);

    const matchesLocation =
      filterLocation === "all" || product.location === filterLocation;

    const matchesPrice =
      !maxPrice || product.price <= parseInt(maxPrice, 10);

    return (
      matchesSearch && matchesOrganic && matchesLocation && matchesPrice
    );
  });

  const uniqueLocations = [
    ...new Set(products.map((product) => product.location)),
  ];
  const handleAddCart = async (productId) => {
    try {
      const res = await axiosInstance.post('/api/cart/add', {
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
    <section className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
        🛒 FarmFresh Marketplace
      </h2>

      {/* 🔍 Search & Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by product or seller"
          className="p-2 border rounded-md w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-2 border rounded-md w-full"
          value={filterOrganic}
          onChange={(e) => setFilterOrganic(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="organic">Organic Only</option>
          <option value="non-organic">Non-Organic Only</option>
        </select>

        <select
          className="p-2 border rounded-md w-full"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          <option value="all">All Locations</option>
          {uniqueLocations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max Price (₹)"
          className="p-2 border rounded-md w-full"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* 🧺 Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product?.id}
              className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-green-800">
                  {product?.name}
                </h3>
                {product.isOrganic && (
                  <FaLeaf className="text-green-500" title="Organic" />
                )}
              </div>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                <FaMapMarkerAlt className="inline mr-1 text-red-400" />
                {product.location}
              </p>
              <p className="text-md mt-2">
                <strong>Price:</strong> ₹{product.price} / {product.quantity}
              </p>
              <p className="flex items-center mt-1 text-yellow-500">
                {Array.from({ length: Math.round(product.rating) }).map(
                  (_, i) => (
                    <FaStar key={i} />
                  )
                )}
                <span className="ml-2 text-gray-600">{product.rating}</span>
              </p>
              <button className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-green-700"
              onClick={()=>handleAddCart(product._id)}>
                  <FiShoppingCart className="inline mr-1" />Add to Cart
                </button>
              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              onClick={()=> navigate(`/product/${product._id}`)}
               >
                Explore
              </button>
            </div>
          ))
        )}
      </div>
    </section>
    </Layout>
  );
};

export default Marketplace;
