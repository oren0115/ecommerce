import React, { useState, useEffect } from "react";
import {
  Button,
  Textarea,
  Card,
  CardBody,
  Avatar,
  Skeleton,
} from "@heroui/react";
import ProductRating from "./ProductRating";
import { reviewAPI } from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";

interface Review {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    fullname: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  onAddReview?: (rating: number, comment: string) => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState<{
    canReview: boolean;
    reason?: string;
  } | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(true);
  const { user } = useAuth();

  // Hapus useEffect mock, ganti dengan fetch ke API
  useEffect(() => {
    setLoading(true);
    reviewAPI
      .getByProduct(productId)
      .then((res: any) => {
        setReviews((res.data as any).data || []);
      })
      .catch(() => setReviews([]))
      .then(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!user) {
      setEligibility(null);
      setEligibilityLoading(false);
      return;
    }
    setEligibilityLoading(true);
    reviewAPI
      .checkEligibility(productId)
      .then((res: any) => setEligibility((res.data as any).data))
      .catch(() =>
        setEligibility({
          canReview: false,
          reason: "Gagal memeriksa status review.",
        })
      )
      .then(() => setEligibilityLoading(false));
  }, [productId, user]);

  // Ubah handleSubmitReview agar post ke API
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Silakan login untuk memberikan review.");
      return;
    }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await reviewAPI.add(productId, {
        rating: newRating,
        comment: newComment,
      });
      // Refetch reviews setelah submit
      const res: any = await reviewAPI.getByProduct(productId);
      setReviews((res.data as any).data || []);
      setNewRating(5);
      setNewComment("");
      setShowReviewForm(false);
      // Refetch eligibility after review
      reviewAPI
        .checkEligibility(productId)
        .then((res) => setEligibility((res.data as any).data));
    } catch (error: any) {
      if (error?.response?.status === 401) {
        alert("Silakan login untuk memberikan review.");
      } else {
        alert("Gagal mengirim review. Silakan coba lagi.");
      }
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="w-32 h-5 rounded-lg mb-6" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-24 h-3 rounded-lg" />
                </div>
                <Skeleton className="w-full h-12 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-foreground">Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 text-sm">
              <ProductRating
                rating={averageRating}
                reviewCount={0}
                showReviewCount={false}
                size="sm"
              />
              <span className="text-default-500">
                {averageRating.toFixed(1)} • {reviews.length} reviews
              </span>
            </div>
          )}
        </div>
        {eligibilityLoading ? (
          <span className="text-sm text-default-400">
            Checking eligibility...
          </span>
        ) : eligibility && eligibility.canReview ? (
          <Button
            variant="light"
            size="sm"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-primary">
            {showReviewForm ? "Cancel" : "Write review"}
          </Button>
        ) : eligibility && eligibility.reason ? (
          <span className="text-xs text-default-400">{eligibility.reason}</span>
        ) : null}
      </div>

      {/* Review Form */}
      {showReviewForm && eligibility && eligibility.canReview && (
        <Card className="bg-default-50 border border-default-100">
          <CardBody className="p-6">
            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      isIconOnly
                      variant="light"
                      size="sm"
                      onClick={() => setNewRating(star)}
                      className="focus:outline-none">
                      <svg
                        className={`w-6 h-6 ${
                          star <= newRating
                            ? "text-warning"
                            : "text-default-200"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience..."
                  variant="bordered"
                  className="bg-background"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  variant="solid"
                  size="sm"
                  className="bg-foreground text-background">
                  {submitting ? "Posting..." : "Post review"}
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setShowReviewForm(false)}
                  className="text-default-600">
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardBody className="p-12 text-center">
            <div className="w-12 h-12 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-default-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">
              No reviews yet
            </h3>
            <p className="text-sm text-default-500">
              Be the first to share your thoughts
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="group">
              <div className="flex items-start gap-3 mb-3">
                <Avatar
                  name={review.userId.fullname}
                  className="flex-shrink-0"
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {review.userId.fullname}
                    </span>
                    <ProductRating
                      rating={review.rating}
                      reviewCount={0}
                      showReviewCount={false}
                      size="sm"
                    />
                  </div>
                  <span className="text-xs text-default-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
              <div className="ml-11">
                <p className="text-sm text-default-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
