import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePhotoProps {
  currentImage?: string;
  userName: string;
  size?: "sm" | "md" | "lg";
  showChangeButton?: boolean;
  onImageChange?: (imageUrl: string) => void;
}

export default function ProfilePhoto({
  currentImage,
  userName,
  size = "md",
  showChangeButton = false,
  onImageChange,
}: ProfilePhotoProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPG, PNG, GIF)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);

      // Convert to base64 for persistent storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        toast({
          title: "📸 Photo selected!",
          description: 'Click "Update Photo" to save your new profile picture.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !previewUrl) return;

    setIsUploading(true);
    try {
      // Simulate API call - replace with actual upload logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store in localStorage for persistence across pages
      localStorage.setItem("profileImage", previewUrl);

      if (onImageChange) {
        onImageChange(previewUrl);
      }

      toast({
        title: "✅ Success!",
        description: "Profile photo uploaded successfully!",
      });
      setIsDialogOpen(false);
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to update profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="relative group">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <Avatar
                className={`${sizeClasses[size]} transition-all duration-200 group-hover:ring-2 group-hover:ring-saffron-500 group-hover:ring-offset-2`}
              >
                {currentImage ? (
                  <AvatarImage src={currentImage} alt={userName} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-r from-saffron-500 to-orange-500 text-white font-bold">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              {size !== "sm" && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              )}
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Profile Photo</DialogTitle>
              <DialogDescription>
                Choose a new profile photo. Supported formats: JPG, PNG, GIF
                (max 5MB)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Current/Preview Image */}
              <div className="flex justify-center">
                <Avatar className="w-24 h-24">
                  {previewUrl || currentImage ? (
                    <AvatarImage
                      src={previewUrl || currentImage}
                      alt={userName}
                    />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-r from-saffron-500 to-orange-500 text-white text-xl font-bold">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* File Input */}
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="profile-photo-input"
                />
                <label
                  htmlFor="profile-photo-input"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedImage || isUploading}
                  className="flex-1 bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
                >
                  {isUploading ? "Uploading..." : "Update Photo"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Optional change button for profile pages */}
      {showChangeButton && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs mt-2">
              <Camera className="w-3 h-3 mr-1" />
              Change Photo
            </Button>
          </DialogTrigger>
        </Dialog>
      )}
    </>
  );
}
