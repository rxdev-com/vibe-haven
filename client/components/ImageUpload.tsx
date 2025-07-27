import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  Camera,
  Eye,
  Trash2,
  Plus
} from "lucide-react";

interface BusinessImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: "facility" | "equipment" | "products" | "certificates" | "team";
  isMain: boolean;
}

interface ImageUploadProps {
  images: BusinessImage[];
  onImagesChange: (images: BusinessImage[]) => void;
  isEditing: boolean;
  businessType: "supplier" | "vendor";
}

export default function ImageUpload({ images, onImagesChange, isEditing, businessType }: ImageUploadProps) {
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<BusinessImage | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const categories = [
    { value: "facility", label: "Facility/Factory", icon: "🏭" },
    { value: "equipment", label: "Equipment", icon: "⚙️" },
    { value: "products", label: "Products", icon: "📦" },
    { value: "certificates", label: "Certificates", icon: "📜" },
    { value: "team", label: "Team", icon: "👥" }
  ];

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !isEditing) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: BusinessImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            title: file.name.replace(/\.[^/.]+$/, ""),
            description: "",
            category: "facility",
            isMain: images.length === 0
          };
          onImagesChange([...images, newImage]);
          
          addNotification({
            title: "Image Uploaded",
            message: `${file.name} has been uploaded successfully`,
            type: "success",
            icon: "📸"
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
    
    addNotification({
      title: "Image Removed",
      message: "Image has been removed from your gallery",
      type: "info",
      icon: "🗑️"
    });
  };

  const updateImage = (imageId: string, updates: Partial<BusinessImage>) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    );
    onImagesChange(updatedImages);
  };

  const setAsMain = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isMain: img.id === imageId
    }));
    onImagesChange(updatedImages);
    
    addNotification({
      title: "Main Image Updated",
      message: "This image is now your main business photo",
      type: "success",
      icon: "⭐"
    });
  };

  const getCategoryIcon = (category: string) => {
    return categories.find(cat => cat.value === category)?.icon || "📷";
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || "Other";
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {isEditing && (
        <Card 
          className={`border-2 border-dashed transition-colors ${
            dragOver ? 'border-saffron-400 bg-saffron-50' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Business Images
                </h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop images here, or click to browse
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Images
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
              <p className="text-xs text-gray-400">
                Supported formats: JPG, PNG, GIF. Max size: 5MB per image
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Business Gallery ({images.length} images)
            </h3>
            {!isEditing && images.length > 6 && (
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group">
                <div className="relative">
                  <img 
                    src={image.url} 
                    alt={image.title}
                    className="w-full h-48 object-cover"
                  />
                  {image.isMain && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                      ⭐ Main Photo
                    </Badge>
                  )}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 bg-white/90"
                  >
                    {getCategoryIcon(image.category)} {getCategoryLabel(image.category)}
                  </Badge>
                  
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!image.isMain && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setAsMain(image.id)}
                        >
                          ⭐
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Image title"
                        value={image.title}
                        onChange={(e) => updateImage(image.id, { title: e.target.value })}
                      />
                      <Input
                        placeholder="Description"
                        value={image.description}
                        onChange={(e) => updateImage(image.id, { description: e.target.value })}
                      />
                      <select
                        value={image.category}
                        onChange={(e) => updateImage(image.id, { category: e.target.value as any })}
                        className="w-full p-2 border rounded-md"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{image.title}</h4>
                      {image.description && (
                        <p className="text-sm text-gray-600">{image.description}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Images State */}
      {images.length === 0 && !isEditing && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Added</h3>
            <p className="text-gray-500">
              {businessType === "supplier" 
                ? "Upload photos of your facility, equipment, and products to build trust with vendors"
                : "Add photos of your food stall, kitchen, and specialties to showcase your business"
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      {isEditing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 mb-2">📸 Photo Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Take clear, well-lit photos of your {businessType === "supplier" ? "factory/warehouse" : "food stall"}</li>
              <li>• Include photos of your equipment and {businessType === "supplier" ? "storage facilities" : "cooking area"}</li>
              <li>• Add certificates and licenses to build credibility</li>
              <li>• Team photos help create a personal connection</li>
              <li>• Set your best photo as the main image</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
