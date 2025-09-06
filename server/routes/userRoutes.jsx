// routes/userRoutes.js
import express from "express";
import User from "../models/user.model.js";
const router = express.Router();
// GET nearby farmers
router.get("/nearby", async (req, res) => {
  const { lat, lon, role = "farmer" } = req.query;
  if (!lat || !lon) return res.status(400).json({ message: "Lat/Lon required" });
  try {
    const nearby = await User.find({
      role,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
          $maxDistance: 20000, // 20 km radius
        },
      },
    }).select("userName photo email role location");

    res.json(nearby);
  } catch (err) {
    res.status(500).json({ message: "Error fetching nearby users", error: err });
  }
});

export default router;
