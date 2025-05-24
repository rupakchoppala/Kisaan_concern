import {
    GiPriceTag,
    GiWeight,
  } from "react-icons/gi";
  import {
    MdLocationPin,
    MdDescription,
    MdOutlineStarRate,
  } from "react-icons/md";
  import {
    FaLeaf,
    FaTimesCircle,
    FaUser,
    FaStar,
  } from "react-icons/fa";
  import { useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axiosInstance from "../../utils/axiosInstance";
  import Layout from "../layouts/layout";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FiShoppingCart, FiTag, FiBox } from 'react-icons/fi';
import { GiChemicalDrop } from "react-icons/gi"; 
import { FaTags } from "react-icons/fa";       // or FaFolder, FaThLarge

  const FertilizerCard = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
  
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/pesti/${id}`);
        console.log(res.data);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
      };
      
    const handleRating = async (rating) => {
      try {
        const res = await axiosInstance.put(`/api/pesti/rate/${id}`, {
          rating,
        });
        console.log(res.data);
        setProduct(res.data);
        setUserRating(rating);
      } catch (err) {
        console.error(err);
      }
    };
  
    const handleReviewSubmit = async (e) => {
      e.preventDefault();
      try {
        const token=Cookies.get('token');
        const res = await axiosInstance.post(
            `/api/pesti/review/${id}`,
            {
              rating: userRating,
              comment: reviewComment,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // or your auth logic
              },
            }
          );
        console.log("Review Added:", res.data);
        toast.success('Review submitted');
        setProduct((prev) => ({
          ...prev,
          reviews: [...(prev.reviews || []), res.data.review],
        }));
        setReviewComment("");
        setUserRating(0);
      } catch (err) {
        toast.error(err.response?.data?.message);
        console.error(err);
      }
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
    useEffect(() => {
      fetchProduct();
    }, [id]);
  
    return (
        <Layout>
           <h1 className="text-xl text-center mt-2 text-green-900"> Product OverView</h1>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-lg border border-green-300 shadow-xl rounded-3xl p-6 md:flex gap-8">
            
            {/* Left Section - Product Info */}
            <div className="flex-1 space-y-6">
              {product?.image && (
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
              )}
      
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-green-800"><GiChemicalDrop/>Product: {product?.name}</h2>
      
                <div className="flex items-center text-purple-700 gap-2">
                  <FaUser />
                  <span className="font-medium">Seller:rupak</span>
                </div>
                <div className="flex items-center text-black gap-2">
                  <FaTags />
                  <span className="font-medium">Category:{product?.category}</span>
                </div>
      
                <div className="flex flex-wrap gap-3 text-base">
                  <div className="flex items-center gap-2 text-green-700">
                    <GiPriceTag />
                    Sale Price:₹ {product?.sale_price}
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <GiPriceTag />
                   Original Price: ₹ {product?.original_price}
                  </div>
                  
      
                  <div className="flex items-center gap-2 text-orange-600">
                    <FiTag />
                    Discount: {product?.discount}
                  </div>
      
                  {/* <div className="flex items-center gap-2 text-red-600">
                    <MdLocationPin />
                    {product?.location} 
                  </div> */}
                </div>
               
      
                <div className="flex items-center gap-2">
                  {product?.isOrganic ? (
                    <>
                      <FaLeaf className="text-green-700" />
                      <span className="text-green-700 font-semibold">Organic Product</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-gray-500" />
                      <span className="text-gray-600 font-semibold">Not Organic</span>
                    </>
                  )}
                  
                </div>
      
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition transform hover:scale-105"
                  onClick={()=>handleAddCart(product._id)}>
                    🛒 Add to Cart
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition transform hover:scale-105">
                    💳 Buy Now
                  </button>
                </div>
              </div>
            </div>
      
            {/* Right Section - Description, Rating & Reviews */}
            <div className="flex-1 flex flex-col justify-between gap-6 mt-8 md:mt-0">
              {/* Description */}
              <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
                  <MdDescription />
                  Product Info
                </div>
                <p className="text-gray-700 text-sm">{truncateText(product?.description, 700)}</p>
              </div>
      
              {/* Product Rating */}
              <div className="bg-white border border-yellow-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineStarRate className="text-yellow-500 text-lg" />
                  <span className="text-gray-800 font-semibold text-base">
                    Product Rating: {product?.rating?.toFixed(1) || "No ratings yet"}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`cursor-pointer text-xl transition-transform duration-300 ${
                        (hoverRating || userRating || product?.averageRating) >= star
                          ? "text-yellow-400 scale-110"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
      
              {/* Reviews */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-xl font-semibold text-green-800 mb-2">📝 Reviews</h3>
      
                {/* Submit Review */}
                <form onSubmit={handleReviewSubmit} className="space-y-3 mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`cursor-pointer text-xl ${
                          (hoverRating || userRating) >= star
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-green-500"
                    placeholder="Write your review..."
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition"
                  >
                    Submit Review
                  </button>
                </form>
      
                {/* Display Reviews */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {product?.reviews?.length ? (
                    product.reviews.map((rev, i) => (
                      <div
                        key={i}
                        className="border p-3 rounded-xl bg-gray-100"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-green-700 flex items-center gap-1">
                            <FaUser /> {rev.name}
                          </p>
                          <div className="text-sm text-yellow-500 flex items-center">
                            {[...Array(rev.rating)].map((_, idx) => (
                              <FaStar key={idx} className="text-sm" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{rev.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm italic">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      
    );
  };
  
  export default FertilizerCard;
  