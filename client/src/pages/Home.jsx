import React from "react";
import { FaLeaf, FaBrain, FaHandsHelping, FaStore, FaBullhorn } from "react-icons/fa";
import { Link } from "react-router-dom";
import Layout from "../components/layouts/layout";
const Home = () => {
  return (
    <Layout>
    <div
      className="min-h-screen bg-cover bg-center text-white flex items-center justify-center"
      style={{ backgroundImage: `url('/bgimage.jpg')` }}
    >
    <section className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6 leading-tight">
          Welcome to <span className="text-lime-600">Kisaan Concern</span> 🌾
        </h1>
        <p className="text-lg md:text-xl text-green-900 max-w-3xl mx-auto mb-10">
          Bridging technology with agriculture — empowering farmers through AI-powered disease detection,
          expert guidance, government schemes, and direct sales to customers.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            to="/diagnose"
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-medium transition"
          >
            Diagnose Plant Disease
          </Link>
          <Link
            to="/marketplace"
            className="bg-lime-500 hover:bg-lime-600 text-green-900 px-6 py-3 rounded-full font-medium transition"
          >
            Explore Marketplace
          </Link>
          <Link
            to="/support"
            className="bg-lime-500 hover:bg-lime-600 text-green-900 px-6 py-3 rounded-full font-medium transition"
            >
            <FaHandsHelping className="inline-block mr-1" />
            Get Support
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
            <FaBrain className="text-4xl text-green-700 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">AI Disease Diagnosis</h3>
            <p className="text-gray-600">
              Upload crop images to detect diseases and get instant recommendations on treatments and pesticides.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
            <FaHandsHelping className="text-4xl text-lime-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Expert Consultation</h3>
            <p className="text-gray-600">
              Connect with verified agricultural experts for personalized support and crop guidance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
            <FaStore className="text-4xl text-green-700 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Farmer’s Market</h3>
            <p className="text-gray-600">
              Sell your produce directly to consumers and buyers — no middlemen, better profits.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
            <FaBullhorn className="text-4xl text-yellow-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Awareness & Schemes</h3>
            <p className="text-gray-600">
              Stay updated on the latest government schemes, subsidies, and agriculture policies.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
            <FaHandsHelping className="text-4xl text-lime-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Raise Your Voice</h3>
            <p className="text-gray-600">
              Share challenges faced in your region — let your voice be heard and resolved through community and NGO support.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
            <FaLeaf className="text-4xl text-green-700 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Eco & Farmer First</h3>
            <p className="text-gray-600">
              We prioritize sustainability and empower local farmers to thrive in a digital economy.
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
    </Layout>
  );
};

export default Home;
