import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../models/user.js"; // ✅ Ensure the filename is `user.js`

const router = express.Router();

// User Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await user.findOne({ email }); // ✅ Use `user` instead of `User`
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new user({ name, email, password: hashedPassword }); // ✅ Use `user`
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error signing up" });
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await user.findOne({ email }); // ✅ Use `user`

    if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: existingUser._id, name: existingUser.name, email: existingUser.email } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
