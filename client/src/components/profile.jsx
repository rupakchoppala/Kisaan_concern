import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axiosInstance from "../utils/axiosInstance";
import Layout from "./layouts/layout";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
  });

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const { data } = await axiosInstance.get("/api/auth/me", {
          withCredentials: true,
        });
        setUser(data);
        setAddress(data.address || address);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async () => {
    try {
      const { data } = await axiosInstance.put(
        "/api/auth/update-address",
        { address },
        { withCredentials: true }
      );
      setUser(data);
      setEditing(false);
    } catch (err) {
      console.error("Error updating address:", err);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <Layout>
      <div className="max-w-lg mx-auto mt-10 bg-white shadow rounded-lg p-6 space-y-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center">
          {user.photo ? (
            <img
              src={user.photo}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-700 flex items-center justify-center text-white text-3xl font-bold">
              {user.userName
                ? user.userName
                    .split(" ")
                    .map((n) => n[0].toUpperCase())
                    .join("")
                : ""}
            </div>
          )}
          <h2 className="mt-4 text-xl font-semibold">{user.userName}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600 capitalize">{user.role}</p>
        </div>

        {/* Address Section */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Address</h3>
          {editing ? (
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: "fullName", label: "Full Name" },
                { name: "addressLine1", label: "Address Line 1" },
                { name: "addressLine2", label: "Address Line 2" },
                { name: "city", label: "City" },
                { name: "state", label: "State" },
                { name: "postalCode", label: "Postal Code" },
                { name: "country", label: "Country" },
                { name: "phoneNumber", label: "Phone Number" },
              ].map(({ name, label }) => (
                <input
                  key={name}
                  name={name}
                  value={address[name]}
                  onChange={handleChange}
                  placeholder={label}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              ))}
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleSaveAddress}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditing(false); setAddress(user.address || {}); }}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {address.fullName && <p><strong>Name:</strong> {address.fullName}</p>}
              {address.addressLine1 && <p><strong>Address 1:</strong> {address.addressLine1}</p>}
              {address.addressLine2 && <p><strong>Address 2:</strong> {address.addressLine2}</p>}
              {address.city && <p><strong>City:</strong> {address.city}</p>}
              {address.state && <p><strong>State:</strong> {address.state}</p>}
              {address.postalCode && <p><strong>Postal Code:</strong> {address.postalCode}</p>}
              {address.country && <p><strong>Country:</strong> {address.country}</p>}
              {address.phoneNumber && <p><strong>Phone:</strong> {address.phoneNumber}</p>}

              <button
                onClick={() => setEditing(true)}
                className="text-green-700 font-semibold hover:underline mt-2"
              >
                {address.fullName ? "Edit Address" : "Add Address"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
