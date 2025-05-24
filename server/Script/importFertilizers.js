import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Pesticide from '../models/Fertilizers.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    const dataPath = path.resolve('/home/akshay/Documents/kisaan_concern/server/Script/all_fertilizers_data.json');
    const fertilizers = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await Pesticide.insertMany(fertilizers);
    console.log('Fertilizer data imported successfully!');
    process.exit();
  } catch (err) {
    console.error('Failed to import fertilizers:', err);
    process.exit(1);
  }
};

await connectDB();
await importData();
