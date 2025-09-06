import React, { useEffect, useState } from "react";
import Layout from "../layouts/layout";
import axiosInstance from "../../utils/axiosInstance";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/api/orders/myOrders", { withCredentials: true });
      setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Something went wrong while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openAddressModal = (order) => {
    setSelectedOrder(order);
    setNewAddress(order.shippingAddress || {});
    setShowModal(true);
  };

  const handleAddressChange = async () => {
    try {
      await axiosInstance.put(`/api/orders/updateAddress/${selectedOrder._id}`, {
        shippingAddress: newAddress,
      });
      alert("Address updated successfully!");
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update address");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axiosInstance.put(`/api/orders/cancel/${orderId}`);
      alert("Order cancelled successfully!");
      fetchOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const sortedOrders = orders?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading orders...</p>;
  if (error) return <p className="text-center mt-6 text-red-500 font-medium">{error}</p>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">Your Orders</h2>
        {sortedOrders?.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No orders found.</p>
        ) : (
          <ul className="space-y-6">
            {sortedOrders.map((order) => (
              <li
                key={order._id}
                className={`bg-white border rounded-xl shadow-md p-5 sm:p-6 transition-all ${
                  order.status === "cancelled" ? "opacity-70 border-red-300" : "hover:shadow-lg"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Order ID: {order._id}</span>
                  <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <span className="font-semibold text-gray-700">Items:</span>
                  <ul className="mt-2 space-y-3">
                    {order.items.map((item) => (
                      <li
                        key={item.productId}
                        className="flex items-center gap-4 bg-green-50 p-2 rounded-lg shadow-inner"
                      >
                        <img
                          src={item.productId?.image || "https://via.placeholder.com/60"}
                          alt={item.name}
                          className={`w-16 h-16 object-cover rounded ${
                            order.status === "cancelled" ? "opacity-50 grayscale" : ""
                          }`}
                        />
                        <div className="flex flex-col flex-grow">
                          <span
                            className={`font-medium text-gray-800 ${
                              order.status === "cancelled" ? "line-through" : ""
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                          <span className="text-gray-600 text-sm">Price: ${item.price.toFixed(2)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mb-4 text-gray-700">
                    <span className="font-semibold">Shipping Address:</span>
                    <p className="text-sm mt-1">
                      {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}{" "}
                      {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`},<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode},<br />
                      {order.shippingAddress.country}, Ph: {order.shippingAddress.phoneNumber}
                    </p>
                  </div>
                )}

                {/* Total & Payment */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <span className="font-semibold text-gray-700">Total:</span>
                  <span className="text-gray-800 font-medium text-lg">${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  Payment: {order.paymentInfo.paymentMethod || "COD"} | Status: {order.paymentInfo.paymentStatus}
                </div>

                {/* Status & Actions */}
                <div className="mt-3 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "paid"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    {order.status !== "cancelled" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      >
                        Cancel Order
                      </button>
                    )}
                    {order.status === "pending" && (
                      <button
                        onClick={() => openAddressModal(order)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        Change Address
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Address Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
              <h3 className="text-2xl font-semibold mb-4 text-center">Change Shipping Address</h3>

              <div className="grid grid-cols-1 gap-3 max-h-[70vh] overflow-y-auto">
                {Object.keys(newAddress).map((key) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                    <input
                      type="text"
                      value={newAddress[key] || ""}
                      onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddressChange}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderList;
