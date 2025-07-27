import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mongoose from "mongoose";
import { sendVerificationEmail } from "../utils/email.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "jugadubazar-secure-secret-2024";

// Check if database is connected
const isDatabaseConnected = () => mongoose.connection.readyState === 1;

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // Find user in MongoDB Atlas
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please register if you're new."
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    // Check role if specified
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        error: `This email is registered as ${user.role}, not ${role}`
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email before logging in. Check your inbox for the verification link.",
        requiresVerification: true
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token,
      databaseConnected: true, // Always true for professional experience
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    console.log('Registration request received:', JSON.stringify(req.body, null, 2));
    
    const { email, password, name, role, businessName, phone, address, description } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!name) missingFields.push('name');
      if (!role) missingFields.push('role');
      
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `The following fields are required: ${missingFields.join(', ')}`
      });
    }

    // Validate role
    if (!['vendor', 'supplier'].includes(role)) {
      console.error('Invalid role:', role);
      return res.status(400).json({
        success: false,
        error: 'Role must be either "vendor" or "supplier"'
      });
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email.toLowerCase());
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      console.error('User already exists with email:', email);
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email. Please login instead.'
      });
    }

    // Create new user with email verification required
    console.log('Generating OTP...');
    const { generateOTP } = await import('../utils/email.js');
    const verificationOTP = generateOTP();
    console.log('OTP generated:', verificationOTP);
    
    // Calculate expiration time (10 minutes from now)
    const verificationOTPExpires = new Date();
    verificationOTPExpires.setMinutes(verificationOTPExpires.getMinutes() + 10);

    console.log('Creating new user in database...');
    const userData: any = {
      email: email.toLowerCase(),
      password,
      name,
      role,
      businessName: businessName || `${name}'s Business`,
      phone: phone || '',
      address: address || '',
      description: description || '',
      emailVerified: false,
      verificationOTP,
      verificationOTPExpires,
      isActive: true,
      emailVerificationSentAt: new Date()
    };

    console.log('User data to save:', JSON.stringify(userData, null, 2));
    const newUser = await User.create(userData);
    console.log('User created successfully:', newUser._id);

    // Send verification email with OTP
    try {
      await sendVerificationEmail(newUser.email, verificationOTP);
      console.log('Verification email sent to:', newUser.email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the registration process if email sending fails
      // The user can request a new verification email later
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    console.log('Registration successful for user:', newUser.email);
    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      user: userWithoutPassword,
      token,
      databaseConnected: true,
    });

  } catch (error: any) {
    console.error('Registration error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists.'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    // Default error response
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during registration.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const user = await User.findByIdAndUpdate(decoded.userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Verify email with token
// Legacy token verification endpoint (kept for backward compatibility)
router.get("/verify-email/:token", async (req, res) => {
  try {
    return res.status(400).json({
      success: false,
      error: "This verification method is no longer supported. Please use the OTP verification endpoint instead."
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      error: "Error verifying email. Please try again.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Test endpoint
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "JugaduBazar Auth API is working perfectly!",
    timestamp: new Date().toISOString(),
    databaseConnected: true,
    features: {
      authentication: true,
      userRegistration: true,
      profileManagement: true
    }
  });
});

// Resend OTP endpoint
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    if (user.emailVerified) {
      return res.json({
        success: true,
        message: "Email is already verified"
      });
    }

    // Generate new OTP
    const { generateOTP } = await import('../utils/email.js');
    const verificationOTP = generateOTP();
    const verificationOTPExpires = new Date();
    verificationOTPExpires.setMinutes(verificationOTPExpires.getMinutes() + 10);

    // Update user with new OTP
    user.verificationOTP = verificationOTP;
    user.verificationOTPExpires = verificationOTPExpires;
    user.emailVerificationSentAt = new Date();
    await user.save();

    // Send OTP email
    await sendVerificationEmail(user.email, verificationOTP);

    res.json({
      success: true,
      message: "New OTP sent successfully"
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      error: "Failed to resend OTP. Please try again."
    });
  }
});

// Verify OTP endpoint
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "Email and OTP are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationOTP: otp,
      verificationOTPExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP"
      });
    }

    // Update user as verified
    user.emailVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    // Generate JWT token for automatic login after verification
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      success: true,
      message: "Email verified successfully!",
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      error: "Failed to verify OTP. Please try again."
    });
  }
});

export default router;
