import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GiPlantSeed, GiFarmer } from "react-icons/gi";
import { FaLeaf, FaUsers } from "react-icons/fa";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import ReactPlayer from "react-player/youtube";
import Layout from "../components/layouts/layout";
const awarenessData = {
  farmer: {
    tips: [
      {
        icon: <GiFarmer className="text-4xl text-green-600" />,
        title: "Government Schemes",
        description: "Updates on subsidies, insurance, and PM-KISAN support programs.",
      },
      {
        icon: <MdOutlineTipsAndUpdates className="text-4xl text-yellow-600" />,
        title: "Crop & Fertilizer Tips",
        description: "Best practices for crop rotation and zero-budget farming.",
      },
      {
        icon: <GiPlantSeed className="text-4xl text-lime-600" />,
        title: "Market Awareness",
        description: "Know your crop's worth before selling.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=5aWA5wZl1tQ", // Replace with a relevant govt. video
    audioTitle: "Welcome Farmers!",
    audioUrl: "/audios/farmer_intro.mp3", // Add this audio file to public folder
  },
  consumer: {
    tips: [
      {
        icon: <FaLeaf className="text-4xl text-green-500" />,
        title: "Support Local Farming",
        description: "Buying directly from farmers boosts the local economy.",
      },
      {
        icon: <MdOutlineTipsAndUpdates className="text-4xl text-blue-500" />,
        title: "Food Transparency",
        description: "Learn how your food is grown and harvested.",
      },
      {
        icon: <FaUsers className="text-4xl text-purple-500" />,
        title: "Join Awareness Campaigns",
        description: "Participate in sustainable agriculture movements.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=s6VzRzWG7Do", // Replace with consumer awareness video
    audioTitle: "Welcome Consumers!",
    audioUrl: "/audios/consumer_intro.mp3", // Add this audio file to public folder
  },
};

const Awareness = ({ role = "farmer" }) => {
  const [data, setData] = useState({ tips: [], videoUrl: "", audioUrl: "", audioTitle: "" });

  useEffect(() => {
    setData(awarenessData[role] || {});
  }, [role]);

  return (
    <Layout>
    <section className="p-6 bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl max-w-screen-xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
        Awareness for {role === "farmer" ? "Farmers" : "Consumers"}
      </h2>

      {/* Audio Intro */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{data.audioTitle}</h3>
        <audio controls className="mx-auto">
          <source src={data.audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
        {data.tips.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-green-100 hover:shadow-xl"
          >
            <div className="mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold text-green-700">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Embedded Video */}
      <div className="my-8 text-center">
        <h3 className="text-xl font-bold text-green-700 mb-4">Watch this awareness video</h3>
        <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
          <ReactPlayer url={data.videoUrl} width="100%" height="100%" controls />
        </div>
      </div>

      {/* Community Link */}
      <div className="text-center mt-10">
        <p className="text-md text-gray-700 mb-2">Want to join community discussions or campaigns?</p>
        <a
          href="/community"
          className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
        >
          Explore Community Support
        </a>
      </div>
    </section>
    </Layout>
  );
};

export default Awareness;
