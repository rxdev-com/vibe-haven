import express from "express";

const router = express.Router();

// Mock orders data
const mockOrders = [
  {
    id: "ORD001",
    vendorId: "1",
    supplierId: "2",
    items: ["Premium Mustard Oil (2L)", "Garam Masala (1kg)"],
    amount: 680,
    status: "pending",
    date: "2024-01-15",
    vendor: "Rajesh's Chaat Corner",
    supplier: "Kumar Oil Mills",
  }
];

// Get all orders
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: mockOrders,
    count: mockOrders.length,
  });
});

// Create new order
router.post("/", (req, res) => {
  const { items, amount, vendorId, supplierId } = req.body;
  
  const newOrder = {
    id: `ORD${(mockOrders.length + 1).toString().padStart(3, '0')}`,
    vendorId,
    supplierId,
    items,
    amount,
    status: "pending",
    date: new Date().toISOString().split('T')[0],
    vendor: "Mock Vendor",
    supplier: "Mock Supplier",
  };
  
  mockOrders.push(newOrder);
  
  res.status(201).json({
    success: true,
    data: newOrder,
    message: "Order created successfully",
  });
});

export default router;
