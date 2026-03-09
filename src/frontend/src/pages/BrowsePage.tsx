import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Star,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import type { ServiceCategory, ServiceProvider } from "../backend";
import {
  useReviewsForProvider,
  useSearchProviders,
  useSubmitReview,
} from "../hooks/useQueries";
import { allCategories, categoryMeta } from "../utils/serviceUtils";

// ─────────────────────────────────────────────
// Star Rating Display
// ─────────────────────────────────────────────
function StarDisplay({
  rating,
  max = 5,
  size = "sm",
}: {
  rating: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────
// Star Rating Selector (interactive)
// ─────────────────────────────────────────────
function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <fieldset
      className="flex items-center gap-1 border-none p-0 m-0"
      aria-label="Star rating"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </fieldset>
  );
}

// ─────────────────────────────────────────────
// Format timestamp from nanoseconds
// ─────────────────────────────────────────────
function formatReviewDate(createdAtNs: bigint): string {
  // Backend stores nanoseconds; convert to ms
  const ms = Number(createdAtNs / BigInt(1_000_000));
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─────────────────────────────────────────────
// Reviews Section (inside dialog)
// ─────────────────────────────────────────────
function ReviewsSection({ providerId }: { providerId: bigint }) {
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useReviewsForProvider(providerId);
  const submitReview = useSubmitReview();

  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (rating === 0) {
      setSubmitError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setSubmitError("Please write a comment.");
      return;
    }

    setSubmitError(null);
    try {
      await submitReview.mutateAsync({
        providerId,
        reviewerName: reviewerName.trim(),
        rating: BigInt(rating),
        comment: comment.trim(),
      });
      // Reset form on success
      setReviewerName("");
      setRating(0);
      setComment("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch {
      setSubmitError("Failed to submit your review. Please try again.");
    }
  };

  return (
    <div className="space-y-4 pt-2 border-t border-border/60">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-3.5 h-3.5 text-primary" />
        <h4 className="font-display font-semibold text-sm text-foreground">
          Reviews
        </h4>
        {reviews.length > 0 && (
          <span className="text-xs text-muted-foreground ml-auto">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Review list */}
      <div data-ocid="browse.provider_detail.review_list">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="browse.provider_detail.review_list.loading_state"
          >
            {[1, 2].map((k) => (
              <div key={k} className="p-3 rounded-xl bg-muted/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-16 ml-auto" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            className="text-center py-4 text-sm text-destructive"
            data-ocid="browse.provider_detail.review_list.error_state"
          >
            Could not load reviews. Please try again.
          </div>
        ) : reviews.length === 0 ? (
          <div
            className="text-center py-6 rounded-xl bg-muted/40"
            data-ocid="browse.provider_detail.review_empty_state"
          >
            <Star className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No reviews yet. Be the first!
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-56">
            <div className="space-y-3 pr-2">
              {reviews.map((review, idx) => (
                <motion.div
                  key={String(review.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                  className="p-3 rounded-xl bg-muted/50 border border-border/40"
                  data-ocid={`browse.provider_detail.review.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {review.reviewerName}
                      </span>
                      <StarDisplay rating={Number(review.rating)} />
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatReviewDate(review.createdAt)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Submit review form */}
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <h5 className="font-display font-semibold text-xs text-foreground mb-3 uppercase tracking-wide">
          Leave a Review
        </h5>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Reviewer Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="reviewer-name"
              className="text-xs text-muted-foreground"
            >
              Your Name
            </Label>
            <Input
              id="reviewer-name"
              placeholder="e.g. Jane Smith"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              disabled={submitReview.isPending}
              className="h-8 text-sm"
              data-ocid="browse.provider_detail.review.input"
            />
          </div>

          {/* Star Rating */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Rating</Label>
            <StarSelector value={rating} onChange={setRating} />
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <Label
              htmlFor="review-comment"
              className="text-xs text-muted-foreground"
            >
              Comment
            </Label>
            <Textarea
              id="review-comment"
              placeholder="Share your experience with this provider..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitReview.isPending}
              className="text-sm resize-none min-h-[72px]"
              data-ocid="browse.provider_detail.review.textarea"
            />
          </div>

          {/* Error state */}
          <AnimatePresence>
            {(submitError || submitReview.isError) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-xs text-destructive bg-destructive/8 rounded-lg px-3 py-2"
                data-ocid="browse.provider_detail.review.error_state"
              >
                <X className="w-3.5 h-3.5 flex-shrink-0" />
                {submitError ?? "Failed to submit review. Please try again."}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success state */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2"
                data-ocid="browse.provider_detail.review.success_state"
              >
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                Your review has been submitted. Thank you!
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            size="sm"
            disabled={submitReview.isPending}
            className="w-full gap-2"
            data-ocid="browse.provider_detail.review.submit_button"
          >
            {submitReview.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Star className="w-3.5 h-3.5" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Provider Card
// ─────────────────────────────────────────────
function ProviderCard({
  provider,
  index,
  onClick,
}: {
  provider: ServiceProvider;
  index: number;
  onClick: () => void;
}) {
  const meta = categoryMeta[provider.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      data-ocid={`browse.provider_card.${index + 1}`}
    >
      <button
        type="button"
        className="w-full text-left group p-5 rounded-2xl bg-card border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl ${meta.bgClass} flex items-center justify-center text-xl flex-shrink-0`}
          >
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-foreground truncate">
              {provider.name}
            </h3>
            <Badge
              variant="secondary"
              className={`text-xs mt-1 ${meta.bgClass} ${meta.colorClass} border ${meta.borderClass}`}
            >
              {meta.label}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{provider.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{Number(provider.yearsExperience)} yrs experience</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{provider.availability}</span>
          </div>
        </div>

        {/* CTA hint */}
        <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            See reviews
          </span>
          <span
            className={`text-xs font-medium ${meta.colorClass} group-hover:underline`}
          >
            View Profile →
          </span>
        </div>
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Provider Detail Dialog
// ─────────────────────────────────────────────
function ProviderDetailDialog({
  provider,
  open,
  onClose,
}: {
  provider: ServiceProvider | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!provider) return null;
  const meta = categoryMeta[provider.category];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        data-ocid="browse.provider_detail.dialog"
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-14 h-14 rounded-xl ${meta.bgClass} flex items-center justify-center text-2xl`}
            >
              {meta.icon}
            </div>
            <div>
              <DialogTitle className="font-display text-xl font-bold">
                {provider.name}
              </DialogTitle>
              <Badge
                variant="secondary"
                className={`text-xs mt-1 ${meta.bgClass} ${meta.colorClass} border ${meta.borderClass}`}
              >
                {meta.label}
              </Badge>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Provider details for {provider.name}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="space-y-4 pr-1">
            {/* Bio */}
            {provider.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3">
                {provider.bio}
              </p>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/60">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <MapPin className="w-3 h-3" />
                  Location
                </div>
                <p className="text-sm font-medium text-foreground">
                  {provider.location}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/60">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Briefcase className="w-3 h-3" />
                  Experience
                </div>
                <p className="text-sm font-medium text-foreground">
                  {Number(provider.yearsExperience)} years
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/60 col-span-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Clock className="w-3 h-3" />
                  Availability
                </div>
                <p className="text-sm font-medium text-foreground">
                  {provider.availability}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <h4 className="font-display font-semibold text-sm text-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Contact Information
              </h4>
              <a
                href={`mailto:${provider.email}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/60 hover:bg-muted transition-colors group"
              >
                <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {provider.email}
                </span>
              </a>
              <a
                href={`tel:${provider.phone}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/60 hover:bg-muted transition-colors group"
              >
                <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {provider.phone}
                </span>
              </a>
            </div>

            {/* Reviews */}
            <ReviewsSection providerId={provider.id} />
          </div>
        </ScrollArea>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          data-ocid="browse.provider_detail.close_button"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Provider Grid Skeleton
// ─────────────────────────────────────────────
function ProviderGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
        <div
          key={key}
          className="p-5 rounded-2xl bg-card border border-border/60 space-y-3"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Browse Page
// ─────────────────────────────────────────────
export function BrowsePage() {
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | null>(
    null,
  );
  const [locationFilter, setLocationFilter] = useState("");
  const [searchLocation, setSearchLocation] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: providers = [],
    isLoading,
    isError,
  } = useSearchProviders(categoryFilter, searchLocation);

  const handleSearch = useCallback(() => {
    setSearchLocation(locationFilter.trim() || null);
  }, [locationFilter]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value === "all" ? null : (value as ServiceCategory));
  };

  const clearFilters = () => {
    setCategoryFilter(null);
    setLocationFilter("");
    setSearchLocation(null);
  };

  const hasFilters = !!categoryFilter || !!searchLocation;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Browse Service Providers
            </h1>
            <p className="text-white/70">
              Discover skilled professionals ready to help in your area.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <motion.div
          className="bg-card border border-border/60 rounded-2xl p-4 md:p-6 mb-8 shadow-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="font-display font-semibold text-sm text-foreground">
              Filter Providers
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={categoryFilter ?? "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger
                className="w-full sm:w-52"
                data-ocid="browse.category_select"
              >
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((cat) => {
                  const meta = categoryMeta[cat];
                  return (
                    <SelectItem key={cat} value={cat}>
                      <span className="flex items-center gap-2">
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9"
                  data-ocid="browse.search_input"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="gap-1.5 flex-shrink-0"
                data-ocid="browse.search_button"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </Button>
            )}
          </div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div data-ocid="browse.providers_list">
            <ProviderGridSkeleton />
          </div>
        ) : isError ? (
          <div className="text-center py-20" data-ocid="browse.error_state">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-display font-bold text-foreground mb-2">
              Failed to load providers
            </h3>
            <p className="text-muted-foreground text-sm">
              Please try refreshing the page.
            </p>
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-20" data-ocid="browse.providers_list">
            <div className="text-center" data-ocid="browse.empty_state">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center text-4xl mx-auto mb-4">
                🔍
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                No providers found
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {hasFilters
                  ? "Try adjusting your filters or expanding your search area."
                  : "No approved providers are available yet. Check back soon!"}
              </p>
              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div data-ocid="browse.providers_list">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {providers.length}
                </span>{" "}
                provider{providers.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {providers.map((provider, idx) => (
                  <ProviderCard
                    key={String(provider.id)}
                    provider={provider}
                    index={idx}
                    onClick={() => {
                      setSelectedProvider(provider);
                      setDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <ProviderDetailDialog
        provider={selectedProvider}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setTimeout(() => setSelectedProvider(null), 200);
        }}
      />
    </div>
  );
}
