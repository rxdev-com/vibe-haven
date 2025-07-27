import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "vendor" | "supplier";
  businessName?: string;
  location?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  emailVerified: boolean;
  emailVerificationSentAt: Date;
  verificationOTP: string;
  verificationOTPExpires: Date;
  deliverySettings?: {
    areas: string[];
    minOrder: number;
    deliveryFee: number;
    freeDeliveryAbove: number;
  };
  businessInfo?: {
    gst?: string;
    pan?: string;
    established?: Date;
    description?: string;
  };
  // coordinates?: {
  //   lat: number;
  //   lng: number;
  // };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["vendor", "supplier"],
  },
  businessName: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  profileImage: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationSentAt: {
    type: Date,
  },
  verificationOTP: {
    type: String,
  },
  verificationOTPExpires: {
    type: Date,
  },
  deliverySettings: {
    areas: [String],
    minOrder: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    freeDeliveryAbove: { type: Number, default: 1000 },
  },
  businessInfo: {
    gst: String,
    pan: String,
    established: Date,
    description: String,
  },
  // coordinates: {
  //   lat: { type: Number, required: false },
  //   lng: { type: Number, required: false },
  // },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
