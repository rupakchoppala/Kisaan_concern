import React, { useState,useEffect } from 'react';
import RecomFertilizers from '../components/products/Recommend Fertiliser';
import { motion } from 'framer-motion';
import ChatBot from '../components/ChatBot';
import {  FaRobot } from "react-icons/fa";
import WeatherAlerts from '../components/waether_alert';
import Layout from '../components/layouts/layout';
const Diagnose = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setResponse(data);
      fetchFertilizerBrands(data?.recommended_fertilizer?.recommended_fertilizers);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };
 const fineTunePrompt = (fertilizers) => {
  return `
You are a helpful assistant. Respond concisely and only in the format specified below. Do not include any explanations, disclaimers, or additional information.

Fertilizers: ${fertilizers.join(", ")}

Respond with the top 3 brands for each fertilizer in **only** this format:

FERTILIZER NAME:
1. Brand Name - Price: $X - Link: https://example.com
2. Brand Name - Price: $X - Link: https://example.com
3. Brand Name - Price: $X - Link: https://example.com

Only provide this format for each fertilizer. Do not include anything else.
`;
};

  
    // Function to send fertilizer recommendations to Gemini API
    const fetchFertilizerBrands = async (fertilizers) => {
        setLoading(true);
        try {
          // Define the prompt (You can fine-tune this based on the fertilizers detected)
        //   const prompt = `Suggest top fertilizer brands for the following fertilizers: ${fertilizers.join(', ')}`;
        const prompt=fineTunePrompt(fertilizers);
          // Send request to Gemini API
          const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBEofnpcXPd5v9E71WhmEqOAVGnlHf6Z8Q", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt, // The content to send to the Gemini API
                    },
                  ],
                },
              ],
            }),
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch fertilizer brands");
          }
      
          const data = await response.json();
          console.log(data)
          setBrands(data); // Assuming the response contains brand suggestions
        } catch (error) {
          console.error("Error fetching brands:", error);
        } finally {
          setLoading(false);
        }
      };
      
      const formatGeminiOutput = (responseText) => {
        const sections = responseText.trim().split(/\n\n+/); // split by empty lines between fertilizers
      
        const result = [];
      
        for (const section of sections) {
          const lines = section.trim().split("\n");
          const fertilizerName = lines[0].replace(":", "").trim();
      
          const brands = lines.slice(1).map(line => {
            const match = line.match(/^\d+\.\s+(.*?)\s+-\s+Price:\s+\$([\d.]+)\s+-\s+Link:\s+(https?:\/\/[^\s]+)/);
            if (!match) return null;
      
            return {
              brand: match[1],
              price: parseFloat(match[2]),
              link: match[3],
            };
          }).filter(Boolean);
      
          result.push({
            fertilizer: fertilizerName,
            brands,
          });
        }
      
        return result;
      };
      const geminiText = brands?.candidates?.[0]?.content?.parts?.[0]?.text;
      const formattedData = geminiText ? formatGeminiOutput(geminiText) : [];      
      console.log(formattedData);
            
    
      // UseEffect to send fertilizer recommendations on component mount
      useEffect(() => {
        if (response?.recommended_fertilizer?.recommended_fertilizers > 0) {
          fetchFertilizerBrands(response.recommended_fertilizer.recommended_fertilizers);
        }
      }, [response?.recommended_fertilizer?.recommended_fertilizers]);

  return (
    <Layout>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-green-300 p-6">
    <div className="bg-gradient-to-br from-white via-green-50 to-green-100 shadow-2xl rounded-3xl p-10 w-full max-w-xl text-center transition-all duration-500 transform hover:scale-[1.02]">
  <h2 className="text-3xl font-extrabold mb-6 text-green-800 flex items-center justify-center gap-2 animate-pulse">
    🌿 <span>Smart Plant Diagnosis</span>
  </h2>

  <label
    className="block w-full cursor-pointer bg-white border-2 border-dashed border-green-300 rounded-xl p-6 hover:border-green-500 transition-all duration-300 shadow-inner relative group"
  >
    <input
      type="file"
      onChange={(e) => {
        setFile(e.target.files[0]);
      }}
      className="hidden"
    />

    <div className="flex flex-col items-center justify-center gap-2">
      <div className="w-16 h-16 bg-green-100 border-4 border-green-300 rounded-full flex items-center justify-center text-green-600 text-2xl group-hover:animate-spin">
        📂 
      </div>
      <p className="text-gray-600 text-sm mt-2">
        {file ? (
          <span className="text-green-700 font-medium">{file.name}</span>
        ) : (
          <>
            <span className="text-gray-500 font-medium">Click or drag your leaf image here</span>
            <br />
            <span className="text-xs text-gray-400">(JPG, PNG supported)</span>
          </>
        )}
      </p>
    </div>
  </label>

  <button
    onClick={handleUpload}
    disabled={loading}
    className={`mt-6 w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-transform duration-300 transform ${
      loading ? 'opacity-60 cursor-not-allowed scale-95' : 'hover:scale-105'
    }`}
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2 animate-pulse">
        🔍 Diagnosing...
        <span className="loader ease-linear rounded-full border-2 border-t-2 border-white h-4 w-4"></span>
      </span>
    ) : (
      '🧪 Diagnose'
    )}
  </button>
</div>


      {response && (
  <motion.div
    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 w-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* Disease Info */}
    <div className="bg-green-50 p-4 rounded-xl shadow-inner">
      <h3 className="text-xl font-semibold text-green-800 mb-2">🌱 Disease Detected</h3>
      <p className="text-lg">{response.prediction}</p>


    {/* Fertilizer Recommendation */}
    <div className="bg-green-50 p-4 rounded-xl shadow-inner">
      <h3 className="text-xl font-semibold text-green-800 mb-2">🧪 Recommended Fertilizers</h3>
      <ul className="list-disc list-inside text-gray-800">
        {response.recommended_fertilizer.recommended_fertilizers.map((fertilizer, index) => (
          <li key={index}>{fertilizer}</li>
        ))}
      </ul>
      <h3 className="mt-2 font-medium text-green-700">Note:</h3>
      <p>{response.recommended_fertilizer.notes}</p>
    </div>
    </div>

    {/* Top Brands */}
    <div className="bg-green-50 p-4 rounded-xl shadow-inner">
      <h3 className="text-xl font-semibold text-green-800 mb-2">🏷️ Top Brands</h3>
      {loading ? (
        <p>Loading...</p>
      ) : formattedData.length > 0 ? (
        formattedData.map((item, index) => (
          <div key={index} className="mb-4">
            <h4 className="font-bold text-gray-700">{item.fertilizer}</h4>
            <ul className="ml-4 list-disc">
              {item.brands.map((brand, idx) => (
                <li key={idx}>
                  {brand.brand} - ${brand.price}
                  <a
                    href={brand.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 underline"
                  >
                    Buy Now
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No brand info found.</p>
      )}
    </div>
  </motion.div>
)}
      <div>
      {formattedData.length > 0 && (
  <div className="mt-10 w-full">
    <h2 className="text-4xl font-bold text-center text-green-600 mb-6">🌾 Our Remedies</h2>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <RecomFertilizers filterNames={response?.recommended_fertilizer?.recommended_fertilizers} />
    </motion.div>
  </div>
)}
  <WeatherAlerts/>
        </div>
        {/* Floating chatbot icon button */}
        
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-50"
        title="Open Chatbot"
        aria-label="Open Chatbot"
      >
        <FaRobot className='text-2xl'/>
      </button>

      {/* Chatbot window */}
      {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
    
    </div>
    </Layout>
  );
};

export default Diagnose;
