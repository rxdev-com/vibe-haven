import mongoose, { Schema, Document } from "mongoose";

export interface IMaterial extends Document {
  name: string;
  category: string;
  price: number;
  unit: string;
  supplier: mongoose.Types.ObjectId;
  stock: number;
  description?: string;
  image?: string;
  images?: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  tags?: string[];
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbohydrates?: number;
  };
  storageInstructions?: string;
  shelfLife?: string;
  origin?: string;
  certifications?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>(
  {
    name: {
      type: String,
      required: [true, "Material name is required"],
      trim: true,
      maxlength: [200, "Material name cannot be longer than 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Oils & Fats",
        "Spices",
        "Grains",
        "Vegetables",
        "Dairy",
        "Meat",
        "Beverages",
        "Snacks",
        "Other",
      ],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: ["kg", "liter", "piece", "gram", "ml", "dozen", "pack"],
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Supplier is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot be longer than 1000 characters"],
    },
    image: String,
    images: [String],
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot be more than 5"],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, "Reviews count cannot be negative"],
    },
    tags: [String],
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: [1, "Minimum order quantity must be at least 1"],
    },
    maxOrderQuantity: Number,
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      fat: Number,
      carbohydrates: Number,
    },
    storageInstructions: String,
    shelfLife: String,
    origin: String,
    certifications: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
MaterialSchema.index({ supplier: 1, category: 1 });
MaterialSchema.index({ name: "text", description: "text" });
MaterialSchema.index({ price: 1 });
MaterialSchema.index({ rating: -1 });
MaterialSchema.index({ inStock: 1, isActive: 1 });

// Update inStock based on stock quantity
MaterialSchema.pre("save", function (next) {
  this.inStock = this.stock > 0;
  next();
});

const Material = mongoose.model<IMaterial>("Material", MaterialSchema);

export default Material;
