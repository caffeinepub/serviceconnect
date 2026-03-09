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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  Clock,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import type { ServiceCategory, ServiceProvider } from "../backend";
import { useSearchProviders } from "../hooks/useQueries";
import { allCategories, categoryMeta } from "../utils/serviceUtils";

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
          <span className="text-xs text-muted-foreground">
            View contact info
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
        className="max-w-lg"
        data-ocid="browse.provider_detail.dialog"
      >
        <DialogHeader>
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

        <div className="space-y-4">
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
        </div>

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
