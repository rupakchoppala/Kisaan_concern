import React from "react";
import Layout from "../layouts/layout";
const OrderList = ({ orders }) => {
  // Sort orders by orderDate descending (newest first)
  const sortedOrders = orders?.slice().sort((a, b) => {
    return new Date(b.orderDate) - new Date(a.orderDate);
  });

  return (
    <Layout>
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {sortedOrders?.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {sortedOrders?.map((order) => (
            <li
              key={order.id}
              className="border rounded-md p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Order ID:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Date:</span>
                <span>{new Date(order.orderDate).toLocaleString()}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Items:</span>
                <ul className="list-disc list-inside ml-4">
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Price:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </Layout>
  );
};

export default OrderList;
