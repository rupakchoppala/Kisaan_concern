import React from 'react';
import { FaSeedling, FaHandsHelping, FaUsers, FaBullhorn } from 'react-icons/fa';
import Layout from '../components/layouts/layout';
const About = () => {
  return (
    <Layout>
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-white py-16 px-6 md:px-16 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6 text-center">
          Empowering Farmers. Connecting Hope.
        </h1>

        <p className="text-lg md:text-xl text-center mb-12 text-gray-600 max-w-3xl mx-auto">
          This platform was born out of a deep-rooted vision — to uplift our farmers, the unsung heroes of our nation. 
          Our mission is to bridge the gap between technology and agriculture through meaningful innovation, transparency, and support.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 hover:scale-105 transition">
            <div className="text-3xl text-green-600 mb-4"><FaSeedling /></div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">AI-Powered Disease Diagnosis</h2>
            <p className="text-gray-600">
              Upload leaf images and get accurate disease predictions along with personalized fertilizer suggestions. 
              Our smart model ensures early diagnosis to protect crops and maximize yield.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 hover:scale-105 transition">
            <div className="text-3xl text-green-600 mb-4"><FaHandsHelping /></div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">NGO Interconnection & Campaigns</h2>
            <p className="text-gray-600">
              Connect with supportive NGOs, raise your voice for regional issues, and contribute to or start meaningful campaigns. 
              We unite efforts to empower every corner of the farming community.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 hover:scale-105 transition">
            <div className="text-3xl text-green-600 mb-4"><FaUsers /></div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">Community & Knowledge Hub</h2>
            <p className="text-gray-600">
              A place to learn, share, and grow — explore government schemes, market opportunities, weather alerts, and 
              agricultural wisdom from fellow farmers and experts alike.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 hover:scale-105 transition">
            <div className="text-3xl text-green-600 mb-4"><FaBullhorn /></div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">Voice for the Voiceless</h2>
            <p className="text-gray-600">
              We believe every farmer deserves to be heard. Our “Raise Your Voice” feature gives you the platform to report 
              local challenges, from water scarcity to unfair trade — and get support.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Our Commitment</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            More than just a project, this is our tribute to the people who feed the nation.
            Built with empathy, driven by data, and refined by real-world needs — this platform is for every farmer, every field, every future.
          </p>
        </div>
      </div>
    </section>
    </Layout>
  );
};

export default About;
