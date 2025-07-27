import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "vendor" | "supplier";
  businessName: string;
  address: string;
  description?: string;
  profileImage?: string;
  isVerified?: boolean;
  emailVerified?: boolean;
  emailVerificationSentAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    role: "vendor" | "supplier",
  ) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  sendEmailVerification: () => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendEmailVerification: () => Promise<boolean>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
  address: string;
  description?: string;
  role: "vendor" | "supplier";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Internal function to send verification email
  const sendVerificationEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Error",
          description: data.error || "Failed to send verification email",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox for the verification link.",
      });
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (
    email: string,
    password: string,
    role: "vendor" | "supplier",
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Make actual API call to backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.requiresVerification) {
          // Show specific message for unverified email
          toast({
            title: "Email Verification Required",
            description: data.error || "Please verify your email before logging in.",
            variant: "destructive",
            action: (
              <Button 
                variant="outline" 
                onClick={() => sendVerificationEmail(email)}
              >
                Resend Verification Email
              </Button>
            ),
          });
        } else {
          // Show regular login error
          toast({
            title: "Login failed",
            description: data.error || "Invalid email or password",
            variant: "destructive",
          });
        }
        return false;
      }

      // Extract user data from API response
      const apiUser = data.user;
      const userData: User = {
        id: apiUser._id,
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone || "+91 98765 43210",
        role: apiUser.role,
        businessName: apiUser.businessName || `${apiUser.name}'s Business`,
        address: apiUser.location || "Delhi, India",
        description: apiUser.description,
        profileImage: apiUser.profileImage,
        isVerified: apiUser.isActive,
        emailVerified: apiUser.emailVerified,
        emailVerificationSentAt: apiUser.emailVerificationSentAt,
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", data.token);

      setUser(userData);

      // Check if email verification is needed
      if (!userData.emailVerified) {
        toast({
          title: "Email Verification Required",
          description: "Please verify your email to access all features.",
          variant: "default",
          action: (
            <Button 
              variant="outline" 
              onClick={() => sendVerificationEmail(userData.email)}
            >
              Resend Verification Email
            </Button>
          ),
        });
      } else {
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}!`,
        });
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sendVerificationEmail, toast]);

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          role: userData.role,
          businessName: userData.businessName,
          address: userData.address,
          description: userData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Registration failed",
          description: data.error || "An error occurred during registration",
          variant: "destructive",
        });
        return false;
      }

      // Extract user data from API response
      const apiUser = data.user;
      const newUser: User = {
        id: apiUser._id,
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone || "+91 98765 43210",
        role: apiUser.role,
        businessName: apiUser.businessName || `${apiUser.name}'s Business`,
        address: apiUser.location || "Delhi, India",
        description: apiUser.description,
        profileImage: apiUser.profileImage,
        isVerified: apiUser.isActive,
        emailVerified: apiUser.emailVerified,
        emailVerificationSentAt: apiUser.emailVerificationSentAt,
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("authToken", data.token);

      setUser(newUser);

      // Show verification message
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
        action: (
          <Button 
            variant="outline" 
            onClick={() => sendVerificationEmail(newUser.email)}
          >
            Resend Verification Email
          </Button>
        ),
      });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sendVerificationEmail, toast]);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  }, [toast]);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, [user]);

  const sendEmailVerification = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    return sendVerificationEmail(user.email);
  }, [user, sendVerificationEmail]);

  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Verification failed",
          description: data.error || "Invalid or expired verification token",
          variant: "destructive",
        });
        return false;
      }

      // Update user's verification status
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      });

      return true;
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const resendEmailVerification = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    // Check if we've sent a verification email recently
    if (user.emailVerificationSentAt) {
      const lastSent = new Date(user.emailVerificationSentAt);
      const now = new Date();
      const diffInMinutes = (now.getTime() - lastSent.getTime()) / (1000 * 60);

      if (diffInMinutes < 1) {
        toast({
          title: "Please wait",
          description: `You can request another verification email in ${Math.ceil(1 - diffInMinutes)} minutes.`,
          variant: "destructive",
        });
        return false;
      }
    }

    const success = await sendVerificationEmail(user.email);

    if (success && user) {
      // Update the last sent time
      const updatedUser = {
        ...user,
        emailVerificationSentAt: new Date().toISOString(),
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return success;
  }, [user, sendVerificationEmail, toast]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    sendEmailVerification,
    verifyEmail,
    resendEmailVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  vendor: {
    email: "vendor@example.com",
    password: "vendor123",
  },
  supplier: {
    email: "supplier@example.com",
    password: "supplier123",
  },
  demo: {
    email: "demo@jugadubazar.com",
    password: "demo123",
  },
};
