import express from 'express';
import passport from "passport";
//import fileUpload from "express-fileupload";
import cors from "cors";

import session from 'express-session';
import './config/passport.js';
import generateToken from './utils/generateToken.js';
const app=express();
//app.use(express.json());
// app.use(
//   cors({
//     origin: [
//       "https://portifolio-generator-4.onrender.com", 
//       "https://portifolio-generator-4.onrender.com/api/user/:id"
//     ], // ✅ Use an array for multiple origins
//     methods: "GET, POST, PUT, DELETE",
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );


// OR - Allow all origins temporarily (Not recommended for production)
app.use(cors());;
  
//app.use(fileUpload({ useTempFiles: true }));
app.use(express.json({ limit: "50mb" })); // Increase payload size limit
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// import authRoutes from './controllers/authController.js';
// import userRoutes from  './controllers/portifolioController.js';
// app.use('/api/auth',authRoutes);
// //app.use("/uploads", express.static("uploads"));
// app.use('/api/user',userRoutes);
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
import authRoutes from './routes/auth.js'
app.get("/auth/google", (req, res, next) => {
  req.session.role = req.query.role || 'farmer';
  console.log("Auth route hit");
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));
// 🔥 Callback route for Google
app.get("/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login"
  }),
  (req, res) => {
    // Success: generate token and redirect with token in URL
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:5173/auth/success?token=${token}`);
  }
);

app.use("/api/auth",authRoutes);
import produtRoutes from './routes/product.js'
app.use('/api/products',produtRoutes);
import cartRoutes from './routes/cartRoutes.js'
app.use('/api/cart',cartRoutes);
import pestiRoutes from  './routes/pesticide.js'
app.use('/api/pesti',pestiRoutes);
export default app;