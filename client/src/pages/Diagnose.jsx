import React, { useState } from 'react';
import RecomFertilizers from '../components/products/Recommend Fertiliser';
import { motion } from 'framer-motion';
import ChatBot from '../components/ChatBot';
import { FaRobot } from "react-icons/fa";
import WeatherAlerts from '../components/waether_alert';
import Layout from '../components/layouts/layout';

const Diagnose = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/predict", { method: "POST", body: formData });
      const data = await res.json();
      setResponse(data);

      // Trigger Gemini call only if fertilizers exist
      if (data?.recommended_fertilizer?.recommended_fertilizers?.length > 0) {
        fetchFertilizerBrands(data.recommended_fertilizer.recommended_fertilizers);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fineTunePrompt = (fertilizers = []) => `
You are a helpful assistant. Respond concisely in this format:

Fertilizers: ${fertilizers.join(", ")}

Respond with top 3 brands:

FERTILIZER NAME:
1. Brand Name - Price: $X - Link: https://example.com
2. Brand Name - Price: $X - Link: https://example.com
3. Brand Name - Price: $X - Link: https://example.com
`;

const fetchFertilizerBrands = async (fertilizers = []) => {
  if (!fertilizers.length) return;
  setLoading(true);

  try {
    const prompt = fineTunePrompt(fertilizers);

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBWrNubp6wFRcsWpyIhNk6S9CJBrYDXyNI",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            text: prompt
          },
          temperature: 0.2,       // low randomness
          candidate_count: 1      // only one response
        }),
      }
    );

    if (!res.ok) throw new Error("Gemini API failed");

    const data = await res.json();
    const geminiText = data?.candidates?.[0]?.content?.[0]?.text || "";
    setFormattedData(formatGeminiOutput(geminiText));
  } catch (err) {
    console.error("Gemini error:", err);
    setFormattedData([]);
  } finally {
    setLoading(false);
  }
};


  const formatGeminiOutput = (text) => {
    if (!text) return [];
    const sections = text.trim().split(/\n\n+/);
    const result = [];

    for (const section of sections) {
      const lines = section.trim().split("\n");
      const fertilizerName = lines[0]?.replace(":", "")?.trim();
      if (!fertilizerName) continue;

      const brands = lines.slice(1).map(line => {
        const match = line.match(/^\d+\.\s+(.*?)\s+-\s+Price:\s+\$([\d.]+)\s+-\s+Link:\s+(https?:\/\/[^\s]+)/);
        return match ? { brand: match[1], price: parseFloat(match[2]), link: match[3] } : null;
      }).filter(Boolean);

      result.push({ fertilizer: fertilizerName, brands });
    }
    return result;
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-green-300 p-6">
        {/* Upload Card */}
        <div className="bg-gradient-to-br from-white via-green-50 to-green-100 shadow-2xl rounded-3xl p-10 w-full max-w-xl text-center hover:scale-[1.02] transition-all">
          <h2 className="text-3xl font-extrabold mb-6 text-green-800 flex items-center justify-center gap-2 animate-pulse">
            🌿 <span>Smart Plant Diagnosis</span>
          </h2>

          <label className="block w-full cursor-pointer bg-white border-2 border-dashed border-green-300 rounded-xl p-6 hover:border-green-500 transition-all relative group">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-16 bg-green-100 border-4 border-green-300 rounded-full flex items-center justify-center text-green-600 text-2xl group-hover:animate-spin">
                📂
              </div>
              <p className="text-gray-600 text-sm mt-2">
                {file ? <span className="text-green-700 font-medium">{file.name}</span> : "Click or drag your leaf image here (JPG, PNG)"}
              </p>
            </div>
          </label>

          <button onClick={handleUpload} disabled={loading} className={`mt-6 w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-transform ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}>
            {loading ? "🔍 Diagnosing..." : "🧪 Diagnose"}
          </button>
        </div>

        {/* Disease & Fertilizers */}
        {response && (
          <motion.div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 w-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Disease */}
            <div className="bg-green-50 p-4 rounded-xl shadow-inner">
              <h3 className="text-xl font-semibold text-green-800 mb-2">🌱 Disease Detected</h3>
              <p className="text-lg">{response.prediction}</p>

              <h3 className="mt-4 text-xl font-semibold text-green-800 mb-2">🧪 Recommended Fertilizers</h3>
              <ul className="list-disc list-inside text-gray-800">
                {(response?.recommended_fertilizer?.recommended_fertilizers || []).map((fertilizer, idx) => (
                  <li key={idx}>{fertilizer}</li>
                ))}
              </ul>
              <p>{response?.recommended_fertilizer?.notes || ''}</p>
            </div>

            {/* Top Brands */}
            <div className="bg-green-50 p-4 rounded-xl shadow-inner">
              <h3 className="text-xl font-semibold text-green-800 mb-2">🏷️ Top Brands</h3>
              {loading ? <p>Loading...</p> : formattedData.length > 0 ? (
                formattedData.map((item, idx) => (
                  <div key={idx} className="mb-4">
                    <h4 className="font-bold text-gray-700">{item.fertilizer}</h4>
                    <ul className="ml-4 list-disc">
                      {item.brands.map((brand, i) => (
                        <li key={i}>
                          {brand.brand} - ${brand.price} <a href={brand.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 underline">Buy Now</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : <p className="text-gray-600">No brand info found.</p>}
            </div>
          </motion.div>
        )}

        {/* Recommended Fertilizers Section */}
        {response?.recommended_fertilizer?.recommended_fertilizers?.length > 0 && (
          <div className="mt-10 w-full">
            <h2 className="text-4xl font-bold text-center text-green-600 mb-6">🌾 Our Remedies</h2>
            <RecomFertilizers filterNames={response.recommended_fertilizer.recommended_fertilizers} />
          </div>
        )}

        <WeatherAlerts />
        <button onClick={() => setChatOpen(true)} className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-50">
          <FaRobot className='text-2xl'/>
        </button>

        {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
      </div>
    </Layout>
  );
};
export default Diagnose;
