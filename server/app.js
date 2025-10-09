import express from 'express';
import passport from "passport";
//import fileUpload from "express-fileupload";
import cors from "cors";
import session from 'express-session';
import './config/passport.js';
import generateToken from './utils/generateToken.js';
const app=express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
//app.use(fileUpload({ useTempFiles: true }));
app.use(express.json({ limit: "50mb" })); // Increase payload size limit
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false,  // better to false
  cookie: {
    httpOnly: true,          // recommended
    secure: false,           // true if using HTTPS (set false for localhost HTTP)
    sameSite: "lax",         // or "none" if cross-site, but then secure:true required
  }
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
import orderRoutes from './controllers/orderController.js'
app.use('/api/checkout',orderRoutes);
import order from './routes/orderRoute.js'; // Changed to relative path
app.use('/api/orders',order);
// import paymentRoutes from './controllers/paymentController.js'
// app.use('/api/payment',paymentRoutes);
import payment from './routes/paymentRoutes.js';
app.use('/api/payment',payment);
export default app;