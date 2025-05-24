import { FaSeedling, FaTrash, FaCheckCircle } from "react-icons/fa";
import { FiTruck } from "react-icons/fi";
import Layout from "../layouts/layout";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ConsumerCart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const GetallProducts = async () => {
    try {
      const res = await axiosInstance.get("api/cart/get_cart");
      console.log(res.data.items)
      setProducts(res.data.items);
    } catch (err) {
      console.error("Error fetching cart items:", err);
    }
  };

  useEffect(() => {
    GetallProducts();
  }, []);

  const getDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const updateQuantity = async (productId, newQty) => {
    try {
      setLoading(true);
      await axiosInstance.put("api/cart/update", {
        productId,
        quantity: newQty,
      });
      setProducts((prev) =>
        prev.map((item) =>
          item.productId._id === productId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async ({ productId }) => {
    try {
      await axiosInstance.delete("api/cart/remove", {
        data: { productId },
      });
      setProducts((prev) =>
        prev.filter((item) => item.productId._id !== productId)
        
      );
      await GetallProducts();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };
  const toggleProductSelection = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((pid) => pid !== id)
        : [...prevSelected, id]
    );
  };
  const getTotalCost = () => {
    return products
      .filter((item) => selectedProducts.includes(item.productId._id))
      .reduce((acc, item) => {
        const rawPrice = item.productId.price || item.productId.sale_price || item.productId.original_price || "0";
        const price = parseFloat(String(rawPrice).replace("Rs.", "").trim());
        return acc + price * item.quantity;
      }, 0);
  };  
  const handleBuyNow = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to buy.");
      return;
    }
    // Redirect or handle logic with selectedProducts
    console.log("Buying these products:", selectedProducts);
    alert("Proceeding to buy selected products!");
  };


  return (
    <Layout>
      <section className="p-6 bg-green-50 min-h-screen">
        <h2 className="text-3xl font-extrabold text-center text-green-900 mb-8 tracking-wide">
          Product Cart
        </h2>

        {products?.length === 0 ? (
          <p className="text-center text-gray-600 italic">Your cart is empty.</p>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {products.map((item) => {
              const { _id, quantity, productId } = item;
              const {
                image,
                name,
                description,
                price,
                quantity: packSize,
                location,
                userId,
                _id: product_id,
              } = productId || {};

              const shortDesc =
                description?.length > 100
                  ? description.slice(0, 100) + "..."
                  : description;

              const deliveryDate = getDeliveryDate();

              return (
                <div
                  key={_id}
                  className="flex items-center gap-6 p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-green-600"
                    checked={selectedProducts.includes(productId._id)}
                    onChange={() => toggleProductSelection(productId._id)}
                  />
                  {/* Image */}
                  <div className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden border border-green-200 shadow-inner">
                    <img
                      src={image || "https://via.placeholder.com/150"}
                      alt={name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-green-800">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 mb-2">
                      {shortDesc}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs font-medium items-center">
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full">
                        Pack: {packSize}
                      </span>
                      <span className="bg-green-100 text-green-900 px-2 py-1 rounded-full">
                        Location: {location}
                      </span>

                      {/* Quantity controls */}
                      <button
                        onClick={() =>
                          quantity > 1 && !loading &&
                          updateQuantity(product_id, quantity - 1)
                        }
                        disabled={loading || quantity <= 1}
                        className={`bg-yellow-100 text-yellow-900 px-3 py-1 rounded-l-full ${
                          loading || quantity <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-yellow-200 text-yellow-900 font-semibold">
                        Qty: {quantity}
                      </span>
                      <button
                        onClick={() =>
                          !loading && updateQuantity(product_id, quantity + 1)
                        }
                        disabled={loading}
                        className={`bg-yellow-100 text-yellow-900 px-3 py-1 rounded-r-full ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        +
                      </button>

                      <button
                        onClick={() => navigate(`/product/${product_id}`)}
                        className="ml-auto text-blue-600 hover:underline"
                      >
                        More...
                      </button>
                    </div>

                    {/* Delivery Date */}
                    <div className="mt-3 flex items-center gap-2 text-green-700 font-semibold text-sm">
                      <FiTruck className="text-lg" />
                      <span>Delivery by {deliveryDate}</span>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between h-full">
                  <h3 className="text-xl font-semibold text-green-800">
                     Seller: {userId?.userName}
                    </h3>
                    <div className="text-right">
                      <span className="text-green-700 font-bold text-lg">
                        ₹{price}
                      </span>
                    </div>
                    <FaTrash
                      onClick={() => removeItem({ productId: product_id })}
                      className="text-red-600 cursor-pointer hover:text-red-800 text-xl"
                      title="Remove item"
                    />
                  </div>
                </div>
              );
            })}

<div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md space-y-4">
              <div className="text-lg font-semibold text-green-800">
                Total Cost: ₹{getTotalCost().toFixed(2)}
              </div>
              <button
                onClick={handleBuyNow}
                className="w-full bg-green-700 text-white py-4 rounded-2xl hover:bg-green-800 flex items-center justify-center gap-3 text-xl font-semibold shadow-lg transition-colors duration-300"
              >
                <FaCheckCircle />
                Buy Now
              </button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default ConsumerCart;
