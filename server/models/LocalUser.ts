import bcrypt from "bcryptjs";

export interface ILocalUser {
  _id: string;
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
  emailVerificationSentAt?: Date;
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
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage that persists during session
const users: ILocalUser[] = [
  {
    _id: "1",
    email: "rxpineple@gmail.com",
    password: "$2a$10$rWZ1lhfRRJDO.D5JyWDdRuf4.0j6B6OJlQVNPaGlzE8yEXq6wWuxi", // 123456
    name: "Rx Pineple",
    role: "vendor",
    businessName: "Pineple Ventures",
    location: "Mumbai, India",
    phone: "+91 98765 43210",
    emailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    email: "vendor@example.com",
    password: "$2a$10$8K1p/a0dRT..vBxyqRzrKe.Bx6VdxIdTANP.iBKpC8U8JcIK4JOoS", // vendor123
    name: "Rajesh Kumar",
    role: "vendor",
    businessName: "Rajesh's Chaat Corner",
    location: "CP, Delhi",
    phone: "+91 87654 32109",
    emailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    email: "supplier@example.com",
    password: "$2a$10$8K1p/a0dRT..vBxyqRzrKe.Bx6VdxIdTANP.iBKpC8U8JcIK4JOoS", // supplier123
    name: "Kumar Singh",
    role: "supplier",
    businessName: "Kumar Oil Mills",
    location: "Delhi, India",
    phone: "+91 76543 21098",
    emailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export class LocalUserModel {
  static async findOne(query: { email?: string; _id?: string }): Promise<ILocalUser | null> {
    if (query.email) {
      return users.find(u => u.email.toLowerCase() === query.email?.toLowerCase()) || null;
    }
    if (query._id) {
      return users.find(u => u._id === query._id) || null;
    }
    return null;
  }

  static async findById(id: string): Promise<ILocalUser | null> {
    return users.find(u => u._id === id) || null;
  }

  static async create(userData: Partial<ILocalUser>): Promise<ILocalUser> {
    const hashedPassword = await bcrypt.hash(userData.password || '', 10);
    
    const newUser: ILocalUser = {
      _id: (users.length + 1).toString(),
      email: userData.email?.toLowerCase() || '',
      password: hashedPassword,
      name: userData.name || '',
      role: userData.role || 'vendor',
      businessName: userData.businessName || `${userData.name}'s Business`,
      location: userData.location || 'Delhi, India',
      phone: userData.phone || '',
      emailVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData
    };

    users.push(newUser);
    return newUser;
  }

  static async findByIdAndUpdate(id: string, updates: Partial<ILocalUser>): Promise<ILocalUser | null> {
    const userIndex = users.findIndex(u => u._id === id);
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date() };
    return users[userIndex];
  }

  static async countDocuments(): Promise<number> {
    return users.length;
  }

  // Method to compare password
  static async comparePassword(user: ILocalUser, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, user.password);
  }
}

export default LocalUserModel;
