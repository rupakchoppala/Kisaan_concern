import dotenv from "dotenv";
dotenv.config({path:"./.env"});
import app from './app.js';
import db from "./config/db.js";
import mongoose from "mongoose";
const port =process.env.PORT;
if (!port) {
    console.error("Port number not found in environment variables!");
    process.exit(1);
}
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});