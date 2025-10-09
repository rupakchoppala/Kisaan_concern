import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js"
import generateToken from "../utils/generateToken.js";
import passport from "passport";
import protect from "../middleware/authMiddleware.js";
const router=express.Router();
// Signup
router.post('/signup', async (req, res) => {
    const { email, password, userName ,role} = req.body;
    //check for the existing users
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });
    //hash the p[assword
    const hashedPassword = await bcrypt.hash(password, 10);
    //create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
     userName,
     role
    });
  
    // const token = generateToken(newUser);
    // res.json({ user: newUser, token });
    //getting the response
    res.status(200).json({
      message:"user registered successfully",
      success:true,
      newUser
    })
  });
  //LOGIN
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ msg: 'Invalid credentials' });
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = generateToken(user);
    res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    res.status(201).json({ user, token });
  
  });
  router.get("/me", protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password -googleId");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  router.put("/update-address", protect, async (req, res) => {
    const { address } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.address = address;
      await user.save();
      res.json(user); // return updated user
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
router.get('/google', 
(req,res,next)=>{
  req.session.role = req.query.role || 'farmer';
  next();
},
passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Callback route
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.redirect('http://localhost:5173/auth/success');
  }
);



  export default router;