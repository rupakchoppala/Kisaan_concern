import { useState } from "react";
import { motion } from "framer-motion";
import { GiFruitBowl, GiPriceTag, GiWeight, GiFarmer, GiFarmTractor } from "react-icons/gi";
import { MdLocationPin, MdDescription, MdOutlineCloudUpload } from "react-icons/md";
import { FaLeaf, FaCheckCircle } from "react-icons/fa";
import Layout from "../layouts/layout";
import toast from 'react-hot-toast';
import axiosInstance from "../../utils/axiosInstance";
import Cookies from "js-cookie";
const FarmerProductUpload = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    location: "",
    isOrganic: false,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let base64Image = "";
    if (form.image) {
      base64Image = await toBase64(form.image);
    }
  
    const newProduct = {
      ...form,
      image: base64Image,
      rating: 0,
    };
  
    try {
      const token = Cookies.get('token');
      const res = await axiosInstance.post("/api/products/upload_product", newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      // onProductAdded(newProduct);
      toast.success("Product uploaded successfully!");
      setForm({
        name: "",
        price: "",
        quantity: "",
        description: "",
        location: "",
        isOrganic: false,
        image: null,
      });
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload product.");
    }
  };
  

  return (
    <Layout>
    <div className="relative w-full py-10 px-4">
      {/* Side Icons */}
      <div className="hidden lg:flex justify-between items-center absolute inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="text-green-700 text-[12rem] ml-4"
        >
          <GiFarmer className="text-green-900" />
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="text-green-700 text-[12rem] mr-4"
        >
          <GiFarmTractor />
        </motion.div>
      </div>

      {/* Main Form Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 backdrop-blur-md bg-white/80 p-6 md:p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto border border-green-300"
      >
        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center flex items-center justify-center gap-2">
          <MdOutlineCloudUpload className="text-4xl text-green-600 animate-bounce" />
          Show Your Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative">
            <GiFruitBowl className="absolute top-3 left-3 text-green-600 text-xl" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="pl-10 border-b-2 w-full py-2 outline-none bg-transparent"
              required
            />
          </div>

          <div className="relative">
            <GiPriceTag className="absolute top-3 left-3 text-yellow-600 text-xl" />
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (₹)"
              className="pl-10 border-b-2 w-full py-2 outline-none bg-transparent"
              required
            />
          </div>

          <div className="relative">
            <GiWeight className="absolute top-3 left-3 text-orange-600 text-xl" />
            <input
              type="text"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Quantity (e.g., 10kg)"
              className="pl-10 border-b-2 w-full py-2 outline-none bg-transparent"
              required
            />
          </div>

          <div className="relative">
  <MdLocationPin className="absolute top-3 left-3 text-red-600 text-xl" />
  <select
    name="location"
    value={form.location}
    onChange={handleChange}
    className="pl-10 border-b-2 w-full py-2 outline-none bg-transparent"
    required
  >
    <option value="" disabled>Select Your Location</option>
    <option value="Hyderabad">Hyderabad</option>
    <option value="Bangalore">Bangalore</option>
    <option value="Delhi">Delhi</option>
    <option value="Mumbai">Mumbai</option>
    <option value="Chennai">Chennai</option>
    {/* Add more locations as needed */}
  </select>
</div>


          <div className="col-span-2 relative">
            <MdDescription className="absolute top-3 left-3 text-blue-600 text-xl" />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product Description"
              className="pl-10 border-b-2 w-full py-2 outline-none bg-transparent"
              rows={3}
              required
            />
          </div>

          <div className="col-span-2 flex flex-col md:flex-row gap-4 items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isOrganic"
                checked={form.isOrganic}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <FaLeaf className="text-green-700 text-xl" />
              <span className="text-green-700 font-medium">Mark as Organic</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm"
              >
                Upload Image
              </label>
              {/* <input
       type="file"
       accept="image/*"
      className="w-full p-6 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
      name="aboutPic"
      onChange={onaboutSelect}
    /> */}
              {form.image && (
                <span className="text-green-800 font-semibold flex items-center gap-1">
                  <FaCheckCircle className="text-green-600" />
                  {form.image.name}
                </span>
              )}
            </label>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-green-500 to-lime-500 text-white font-bold py-3 rounded-full shadow-xl hover:from-green-600 hover:to-lime-600 transition duration-300"
        >
          Show and sell Your Product 
        </motion.button>
      </motion.form>
    </div>
    </Layout>
  );
};

export default FarmerProductUpload;
