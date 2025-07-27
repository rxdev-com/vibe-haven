import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log("⚠️ No MongoDB URI provided - running without database");
      return;
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
      retryWrites: true,
    };

    await mongoose.connect(mongoUri, options);
    console.log("✅ MongoDB Atlas connected successfully");
    
    // Create default admin user if needed
    await createDefaultUsers();
  } catch (error) {
    console.error("⚠️ MongoDB connection error:", error);
    console.log("⚠️ Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

const createDefaultUsers = async () => {
  try {
    const User = (await import("../models/User.js")).default;
    
    // Check if users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("📝 Creating default users...");
      
      const defaultUsers = [
        {
          email: "rxpineple@gmail.com",
          password: "123456",
          name: "Rx Pineple",
          role: "vendor",
          businessName: "Pineple Ventures",
          location: "Mumbai, India",
          phone: "+91 98765 43210",
          emailVerified: true,
        },
        {
          email: "vendor@example.com",
          password: "vendor123",
          name: "Rajesh Kumar",
          role: "vendor", 
          businessName: "Rajesh's Chaat Corner",
          location: "CP, Delhi",
          phone: "+91 87654 32109",
          emailVerified: true,
        },
        {
          email: "supplier@example.com",
          password: "supplier123",
          name: "Kumar Singh",
          role: "supplier",
          businessName: "Kumar Oil Mills", 
          location: "Delhi, India",
          phone: "+91 76543 21098",
          emailVerified: true,
        }
      ];

      for (const userData of defaultUsers) {
        const user = new User(userData);
        await user.save();
      }
      
      console.log("✅ Default users created successfully");
    }
  } catch (error) {
    console.error("⚠️ Error creating default users:", error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected - attempting to reconnect...");
  setTimeout(connectDB, 5000);
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

export default connectDB;
