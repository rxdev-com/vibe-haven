import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/database.js";
import User from "../models/User.js";
import Material from "../models/Material.js";
import Order from "../models/Order.js";

const seedData = {
  suppliers: [
    {
      name: "Kumar Singh",
      email: "kumar@kumaroilmills.com",
      password: "password123",
      phone: "+91 98765 43210",
      role: "supplier",
      businessName: "Kumar Oil Mills",
      businessType: "Wholesale Distributor",
      address: "Industrial Area, Sector 62, Noida, Uttar Pradesh",
      description:
        "Leading supplier of premium quality oils and fats for the food industry. Serving Delhi NCR since 1998.",
      established: "1998",
      license: "FSSAI-12345678901234",
      categories: ["Oils & Fats", "Spices"],
      deliveryAreas: ["Delhi", "Noida", "Gurgaon", "Faridabad"],
      minOrderAmount: 500,
      deliveryCharges: 50,
      freeDeliveryAbove: 1000,
      businessHours: "9:00 AM - 6:00 PM",
      acceptingOrders: true,
      location: {
        type: "Point",
        coordinates: [77.391, 28.6139], // Noida coordinates
      },
      isVerified: true,
      rating: 4.7,
    },
    {
      name: "Priya Sharma",
      email: "priya@spicegarden.com",
      password: "password123",
      phone: "+91 87654 32109",
      role: "supplier",
      businessName: "Spice Garden",
      businessType: "Spice Wholesaler",
      address: "Khari Baoli, Old Delhi, Delhi",
      description:
        "Premium spices and masalas sourced directly from farms across India.",
      established: "2005",
      license: "FSSAI-09876543210987",
      categories: ["Spices"],
      deliveryAreas: ["Delhi", "Gurgaon", "Noida"],
      minOrderAmount: 300,
      deliveryCharges: 40,
      freeDeliveryAbove: 800,
      businessHours: "8:00 AM - 7:00 PM",
      acceptingOrders: true,
      location: {
        type: "Point",
        coordinates: [77.23, 28.6562], // Old Delhi coordinates
      },
      isVerified: true,
      rating: 4.8,
    },
    {
      name: "Ramesh Gupta",
      email: "ramesh@graintraders.com",
      password: "password123",
      phone: "+91 76543 21098",
      role: "supplier",
      businessName: "Grain Traders Co.",
      businessType: "Grain Supplier",
      address: "Azadpur Mandi, Delhi",
      description:
        "Quality grains and cereals for restaurants and food vendors.",
      established: "2010",
      license: "FSSAI-11223344556677",
      categories: ["Grains", "Vegetables"],
      deliveryAreas: ["Delhi", "Noida", "Ghaziabad"],
      minOrderAmount: 400,
      deliveryCharges: 60,
      freeDeliveryAbove: 1200,
      businessHours: "6:00 AM - 8:00 PM",
      acceptingOrders: true,
      location: {
        type: "Point",
        coordinates: [77.1734, 28.7196], // Azadpur coordinates
      },
      isVerified: true,
      rating: 4.3,
    },
  ],

  vendors: [
    {
      name: "Rajesh Kumar",
      email: "rajesh@chaatcorner.com",
      password: "password123",
      phone: "+91 98765 43210",
      role: "vendor",
      businessName: "Rajesh's Chaat Corner",
      address: "Connaught Place, New Delhi",
      description:
        "Serving delicious North Indian street food since 2015. Known for our famous aloo tikki chaat and chole bhature.",
      established: "2015",
      specialties: ["Chaat", "Chole Bhature", "Samosa", "Lassi"],
      location: {
        type: "Point",
        coordinates: [77.209, 28.6139], // CP coordinates
      },
      isVerified: true,
      rating: 4.5,
      totalOrders: 156,
    },
    {
      name: "Sunita Devi",
      email: "sunita@delhisnacks.com",
      password: "password123",
      phone: "+91 87654 32109",
      role: "vendor",
      businessName: "Sharma Snacks",
      address: "Karol Bagh, New Delhi",
      description: "Traditional Delhi-style snacks and sweets since 2018.",
      established: "2018",
      specialties: ["Gol Gappe", "Bhel Puri", "Raj Kachori"],
      location: {
        type: "Point",
        coordinates: [77.19, 28.6519], // Karol Bagh coordinates
      },
      isVerified: true,
      rating: 4.2,
      totalOrders: 89,
    },
  ],
};

const materialTemplates = [
  // Kumar Oil Mills products
  {
    name: "Premium Mustard Oil",
    category: "Oils & Fats",
    price: 180,
    unit: "liter",
    stock: 50,
    description: "Cold-pressed mustard oil with authentic flavor and aroma",
    tags: ["organic", "cold-pressed", "authentic"],
    minOrderQuantity: 1,
    rating: 4.5,
    reviews: 24,
  },
  {
    name: "Pure Ghee",
    category: "Oils & Fats",
    price: 450,
    unit: "kg",
    stock: 30,
    description: "Pure cow ghee made from fresh milk",
    tags: ["pure", "cow-ghee", "premium"],
    minOrderQuantity: 1,
    rating: 4.9,
    reviews: 67,
  },

  // Spice Garden products
  {
    name: "Garam Masala Powder",
    category: "Spices",
    price: 320,
    unit: "kg",
    stock: 25,
    description: "Freshly ground garam masala with authentic Indian spices",
    tags: ["fresh", "aromatic", "authentic"],
    minOrderQuantity: 1,
    rating: 4.8,
    reviews: 42,
  },
  {
    name: "Red Chili Powder",
    category: "Spices",
    price: 280,
    unit: "kg",
    stock: 15,
    description: "Premium quality red chili powder for perfect heat and color",
    tags: ["hot", "premium", "color"],
    minOrderQuantity: 1,
    rating: 4.6,
    reviews: 38,
  },
  {
    name: "Turmeric Powder",
    category: "Spices",
    price: 180,
    unit: "kg",
    stock: 40,
    description: "Pure turmeric powder with high curcumin content",
    tags: ["pure", "medicinal", "organic"],
    minOrderQuantity: 1,
    rating: 4.4,
    reviews: 29,
  },

  // Grain Traders products
  {
    name: "Basmati Rice",
    category: "Grains",
    price: 120,
    unit: "kg",
    stock: 100,
    description: "Premium long-grain basmati rice with authentic aroma",
    tags: ["basmati", "premium", "aromatic"],
    minOrderQuantity: 5,
    rating: 4.3,
    reviews: 18,
  },
  {
    name: "Fresh Onions",
    category: "Vegetables",
    price: 35,
    unit: "kg",
    stock: 200,
    description: "Fresh red onions sourced directly from farms",
    tags: ["fresh", "farm-sourced", "quality"],
    minOrderQuantity: 5,
    rating: 4.2,
    reviews: 31,
  },
  {
    name: "Potatoes",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    stock: 150,
    description: "Fresh potatoes perfect for all cooking needs",
    tags: ["fresh", "versatile", "quality"],
    minOrderQuantity: 10,
    rating: 4.1,
    reviews: 22,
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Material.deleteMany({});
    await Order.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create suppliers
    console.log("👥 Creating suppliers...");
    const createdSuppliers = [];
    for (const supplierData of seedData.suppliers) {
      const supplier = new User(supplierData);
      await supplier.save();
      createdSuppliers.push(supplier);
      console.log(`✅ Created supplier: ${supplier.businessName}`);
    }

    // Create vendors
    console.log("🛒 Creating vendors...");
    const createdVendors = [];
    for (const vendorData of seedData.vendors) {
      const vendor = new User(vendorData);
      await vendor.save();
      createdVendors.push(vendor);
      console.log(`✅ Created vendor: ${vendor.businessName}`);
    }

    // Create materials
    console.log("📦 Creating materials...");
    const supplierMaterialMap = [
      {
        supplier: createdSuppliers[0],
        materials: materialTemplates.slice(0, 2),
      }, // Kumar Oil Mills
      {
        supplier: createdSuppliers[1],
        materials: materialTemplates.slice(2, 5),
      }, // Spice Garden
      {
        supplier: createdSuppliers[2],
        materials: materialTemplates.slice(5, 8),
      }, // Grain Traders
    ];

    for (const { supplier, materials } of supplierMaterialMap) {
      for (const materialData of materials) {
        const material = new Material({
          ...materialData,
          supplier: supplier._id,
        });
        await material.save();
        console.log(
          `✅ Created material: ${material.name} for ${supplier.businessName}`,
        );
      }
    }

    // Create sample order
    console.log("📋 Creating sample orders...");
    const sampleOrderItems = await Material.find().limit(3);

    if (sampleOrderItems.length > 0) {
      const totalAmount = sampleOrderItems
        .slice(0, 2)
        .reduce((sum, material) => sum + material.price * 2, 0);
      const sampleOrder = new Order({
        orderId:
          "ORD" +
          Date.now().toString() +
          Math.random().toString(36).substr(2, 5).toUpperCase(),
        vendor: createdVendors[0]._id,
        supplier: sampleOrderItems[0].supplier,
        items: sampleOrderItems.slice(0, 2).map((material) => ({
          material: material._id,
          materialName: material.name,
          quantity: 2,
          price: material.price,
          unit: material.unit,
        })),
        totalAmount: totalAmount,
        deliveryCharges: 50,
        finalAmount: totalAmount + 50,
        deliveryAddress: createdVendors[0].address,
        status: "delivered",
        paymentStatus: "paid",
      });

      await sampleOrder.save();
      console.log("✅ Created sample order");
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Created:");
    console.log(`   • ${createdSuppliers.length} suppliers`);
    console.log(`   • ${createdVendors.length} vendors`);
    console.log(`   • ${materialTemplates.length} materials`);
    console.log(`   • 1 sample order`);

    console.log("\n🔑 Test accounts:");
    console.log("Suppliers:");
    seedData.suppliers.forEach((supplier) => {
      console.log(`   • ${supplier.email} / password123`);
    });
    console.log("Vendors:");
    seedData.vendors.forEach((vendor) => {
      console.log(`   • ${vendor.email} / password123`);
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  connectDB().then(() => {
    seedDatabase();
  });
}

export default seedDatabase;
