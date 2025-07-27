import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Search,
  Filter,
  TrendingUp,
  Award,
  Calendar,
  Package,
} from "lucide-react";

interface Review {
  id: string;
  orderId: string;
  supplier: string;
  supplierAvatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  items: string[];
  helpful: number;
  verified: boolean;
  response?: {
    text: string;
    date: string;
  };
}

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const mockReviews: Review[] = [
  {
    id: "1",
    orderId: "ORD-2025-001",
    supplier: "Kumar Oil Mills",
    supplierAvatar: "KO",
    rating: 5,
    title: "Excellent quality ghee and timely delivery",
    comment:
      "The pure ghee was of exceptional quality and the mustard oil was fresh. Packaging was excellent and delivery was on time. Highly recommended for anyone looking for authentic products.",
    date: "2025-01-25",
    items: ["Pure Ghee", "Mustard Oil"],
    helpful: 12,
    verified: true,
    response: {
      text: "Thank you for your wonderful feedback! We're delighted that you loved our products. Quality is our top priority.",
      date: "2025-01-25",
    },
  },
  {
    id: "2",
    orderId: "ORD-2025-002",
    supplier: "Fresh Spice Co.",
    supplierAvatar: "FS",
    rating: 4,
    title: "Good spices but delivery was delayed",
    comment:
      "The garam masala and red chili powder were fresh and aromatic. Quality is really good but the delivery was a day late. Overall satisfied with the purchase.",
    date: "2025-01-24",
    items: ["Garam Masala", "Red Chili Powder"],
    helpful: 8,
    verified: true,
  },
  {
    id: "3",
    orderId: "ORD-2025-003",
    supplier: "Grain Merchants",
    supplierAvatar: "GM",
    rating: 5,
    title: "Perfect basmati rice quality",
    comment:
      "The basmati rice was of premium quality with long grains and wonderful aroma. Packaging was professional and the price was very reasonable. Will definitely order again.",
    date: "2025-01-23",
    items: ["Basmati Rice"],
    helpful: 15,
    verified: true,
    response: {
      text: "We're thrilled that you enjoyed our premium basmati rice! Thank you for choosing us.",
      date: "2025-01-23",
    },
  },
  {
    id: "4",
    orderId: "ORD-2025-004",
    supplier: "Organic Vegetables",
    supplierAvatar: "OV",
    rating: 3,
    title: "Fresh vegetables but packaging could be better",
    comment:
      "The onions and tomatoes were fresh and good quality. However, some tomatoes were slightly damaged due to poor packaging. Taste was good overall.",
    date: "2025-01-22",
    items: ["Fresh Onions", "Tomatoes"],
    helpful: 5,
    verified: true,
  },
  {
    id: "5",
    orderId: "ORD-2025-005",
    supplier: "Dairy Fresh",
    supplierAvatar: "DF",
    rating: 4,
    title: "Good paneer quality",
    comment:
      "The paneer was fresh and soft. Perfect for making curries. Price is reasonable and delivery was quick. Satisfied with the purchase.",
    date: "2025-01-21",
    items: ["Paneer"],
    helpful: 7,
    verified: true,
  },
];

const ratingStats: RatingStats = {
  averageRating: 4.2,
  totalReviews: 127,
  distribution: {
    5: 65,
    4: 32,
    3: 18,
    2: 8,
    1: 4,
  },
};

export default function Rating() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const handleSubmitReview = () => {
    if (!newReview.title || !newReview.comment) {
      toast({
        title: "Please fill all fields",
        description: "Title and comment are required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback! Your review has been posted.",
    });

    setNewReview({ rating: 5, title: "", comment: "" });
    setShowReviewForm(false);
  };

  const handleHelpful = (reviewId: string) => {
    toast({
      title: "Thank you!",
      description: "Your feedback has been recorded",
    });
  };

  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const getPercentage = (count: number) => {
    return Math.round((count / ratingStats.totalReviews) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/vendor/dashboard"
                className="flex items-center text-gray-600 hover:text-saffron-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JB</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
                  JugaduBazar
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-yellow-100 text-yellow-700">
                <Star className="w-3 h-3 mr-1" />
                {ratingStats.averageRating}/5
              </Badge>
              <Button
                size="sm"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-gradient-to-r from-saffron-500 to-orange-500"
              >
                Write Review
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ratings & Reviews
          </h1>
          <p className="text-gray-600">
            Your feedback and reviews for supplier orders
          </p>
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
              <CardTitle className="text-3xl font-bold">
                {ratingStats.averageRating}
              </CardTitle>
              <div className="flex justify-center space-x-1 mb-2">
                {renderStars(Math.round(ratingStats.averageRating))}
              </div>
              <CardDescription>
                Based on {ratingStats.totalReviews} reviews
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <span className="text-sm font-medium w-8">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${getPercentage(ratingStats.distribution[rating as keyof typeof ratingStats.distribution])}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {
                        ratingStats.distribution[
                          rating as keyof typeof ratingStats.distribution
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">
                {reviews.filter((r) => r.rating >= 4).length}
              </p>
              <p className="text-sm text-gray-600">Positive Reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">
                {reviews.filter((r) => r.response).length}
              </p>
              <p className="text-sm text-gray-600">Supplier Responses</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <ThumbsUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">
                {reviews.reduce((sum, r) => sum + r.helpful, 0)}
              </p>
              <p className="text-sm text-gray-600">Helpful Votes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">
                {reviews.filter((r) => r.verified).length}
              </p>
              <p className="text-sm text-gray-600">Verified Purchases</p>
            </CardContent>
          </Card>
        </div>

        {/* Write Review Form */}
        {showReviewForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
              <CardDescription>
                Share your experience with other vendors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setNewReview((prev) => ({ ...prev, rating }))
                      }
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= newReview.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <Input
                  placeholder="Summarize your experience..."
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <Textarea
                  placeholder="Tell others about your experience with this supplier..."
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmitReview}>Submit Review</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reviews, suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || ratingFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start by ordering from suppliers to leave reviews"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {review.supplierAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.supplier}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {review.orderId}
                    </Badge>
                  </div>

                  <h5 className="font-medium text-gray-900 mb-2">
                    {review.title}
                  </h5>
                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.items.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  {review.response && (
                    <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mt-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Response from {review.supplier}:
                      </p>
                      <p className="text-sm text-gray-700">
                        {review.response.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.response.date).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
