import React, { useEffect, useState } from "react";
import Layout from "../layouts/layout";
import axiosInstance from "../../utils/axiosInstance";

const ProductOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/api/orders/myproductOrders", {
          withCredentials: true,
        });
        setOrders(data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          err.response?.data?.message || "Something went wrong while fetching orders"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const sortedOrders = orders?.slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading orders...</p>;
  if (error)
    return <p className="text-center mt-6 text-red-500 font-medium">{error}</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">
          Your Orders
        </h2>

        {sortedOrders?.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No orders found.
          </p>
        ) : (
          <ul className="space-y-6">
            {sortedOrders?.map((order) => (
              <li
                key={order._id}
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <span className="font-semibold text-gray-700">Order ID:</span>
                    <span className="text-gray-600 break-all">{order._id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">Date:</span>
                    <span className="text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="font-semibold text-gray-700">Items:</span>
                  <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
                    {order.items.map((item) => (
                      <li key={item.productId} className="text-gray-600">
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <span className="font-semibold text-gray-700">Total Price:</span>
                  <span className="text-gray-800 font-medium text-lg">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span
                    className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Delivery by: {new Date(order.deliveryDate).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default ProductOrderList;
