import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  material: mongoose.Types.ObjectId;
  materialName: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface IOrder extends Document {
  orderId: string;
  vendor: mongoose.Types.ObjectId;
  supplier: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  deliveryCharges: number;
  finalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "rejected";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: "cash" | "card" | "upi" | "wallet";
  deliveryAddress: string;
  deliveryInstructions?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  trackingSteps: Array<{
    step: string;
    time: Date;
    completed: boolean;
    description: string;
  }>;
  rating?: {
    overall: number;
    quality: number;
    delivery: number;
    service: number;
    comment?: string;
  };
  vendorNotes?: string;
  supplierNotes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"],
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Supplier is required"],
    },
    items: [
      {
        material: {
          type: Schema.Types.ObjectId,
          ref: "Material",
          required: true,
        },
        materialName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
        unit: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    deliveryCharges: {
      type: Number,
      default: 0,
      min: [0, "Delivery charges cannot be negative"],
    },
    finalAmount: {
      type: Number,
      required: true,
      min: [0, "Final amount cannot be negative"],
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "wallet"],
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
    },
    deliveryInstructions: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    trackingSteps: [
      {
        step: {
          type: String,
          required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],
    rating: {
      overall: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
      },
      quality: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
      },
      delivery: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
      },
      service: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
      },
      comment: String,
    },
    vendorNotes: String,
    supplierNotes: String,
    cancellationReason: String,
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
OrderSchema.index({ vendor: 1, status: 1 });
OrderSchema.index({ supplier: 1, status: 1 });
// orderId index is automatically created by unique: true
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

// Generate unique order ID before saving
OrderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId =
      "ORD" +
      Date.now().toString() +
      Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Update tracking steps based on status changes
OrderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    const stepMap: { [key: string]: string } = {
      pending: "Order Placed",
      confirmed: "Order Confirmed",
      preparing: "Preparing Order",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
      rejected: "Rejected",
    };

    const stepDescription: { [key: string]: string } = {
      pending: "Order has been placed and waiting for supplier confirmation",
      confirmed: "Order confirmed by supplier and being prepared",
      preparing: "Items are being packed and prepared for delivery",
      out_for_delivery: "Order is on the way to your location",
      delivered: "Order has been successfully delivered",
      cancelled: "Order has been cancelled",
      rejected: "Order has been rejected by supplier",
    };

    // Add or update tracking step
    const existingStepIndex = this.trackingSteps.findIndex(
      (step) => step.step === stepMap[this.status],
    );

    if (existingStepIndex === -1) {
      this.trackingSteps.push({
        step: stepMap[this.status],
        time: new Date(),
        completed: true,
        description: stepDescription[this.status],
      });
    } else {
      this.trackingSteps[existingStepIndex].completed = true;
      this.trackingSteps[existingStepIndex].time = new Date();
    }
  }
  next();
});

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
