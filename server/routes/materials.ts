import express from "express";

const router = express.Router();

// Mock materials data
const mockMaterials = [
  {
    id: "1",
    name: "Premium Mustard Oil",
    category: "Oils & Fats",
    price: 180,
    unit: "liter",
    supplier: "Kumar Oil Mills",
    location: "Delhi",
    rating: 4.5,
    reviews: 24,
    inStock: true,
    stock: 50,
    description: "High-quality mustard oil perfect for cooking",
  },
  {
    id: "2", 
    name: "Garam Masala Powder",
    category: "Spices",
    price: 320,
    unit: "kg",
    supplier: "Spice Masters",
    location: "Delhi",
    rating: 4.8,
    reviews: 18,
    inStock: true,
    stock: 25,
    description: "Authentic blend of aromatic spices",
  }
];

// Get all materials
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: mockMaterials,
    count: mockMaterials.length,
  });
});

// Get material by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const material = mockMaterials.find(m => m.id === id);
  
  if (!material) {
    return res.status(404).json({
      success: false,
      error: "Material not found",
    });
  }
  
  res.json({
    success: true,
    data: material,
  });
});

export default router;
