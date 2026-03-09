import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Clock,
  Loader2,
  LogIn,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { ServiceProvider } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useApproveProvider,
  useIsAdmin,
  usePendingProviders,
  useRejectProvider,
} from "../hooks/useQueries";
import { categoryMeta } from "../utils/serviceUtils";

function AdminSkeleton() {
  return (
    <div className="space-y-4" data-ocid="admin.loading_state">
      {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((key) => (
        <div
          key={key}
          className="p-5 rounded-2xl bg-card border border-border/60 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

function PendingProviderRow({
  provider,
  index,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  provider: ServiceProvider;
  index: number;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  const meta = categoryMeta[provider.category];
  const isProcessing = isApproving || isRejecting;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="bg-card border border-border/60 rounded-2xl p-5 shadow-card"
      data-ocid={`admin.provider_row.${index + 1}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Provider info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl ${meta.bgClass} flex items-center justify-center text-xl flex-shrink-0`}
          >
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-foreground">
                {provider.name}
              </h3>
              <Badge
                variant="secondary"
                className={`text-xs ${meta.bgClass} ${meta.colorClass} border ${meta.borderClass}`}
              >
                {meta.label}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs border-amber-300 text-amber-600 bg-amber-50"
              >
                Pending Review
              </Badge>
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{provider.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 flex-shrink-0" />
                {provider.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {provider.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3 h-3 flex-shrink-0" />
                {Number(provider.yearsExperience)} yrs experience
              </span>
              <span className="flex items-center gap-1.5 sm:col-span-2">
                <Clock className="w-3 h-3 flex-shrink-0" />
                {provider.availability}
              </span>
            </div>

            {provider.bio && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2 border-l-2 border-border pl-2.5">
                {provider.bio}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 flex-shrink-0">
          <Button
            size="sm"
            className="gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white"
            onClick={onApprove}
            disabled={isProcessing}
            data-ocid={`admin.approve_button.${index + 1}`}
          >
            {isApproving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5" />
            )}
            {isApproving ? "Approving..." : "Approve"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="gap-1.5 text-xs"
            onClick={onReject}
            disabled={isProcessing}
            data-ocid={`admin.reject_button.${index + 1}`}
          >
            {isRejecting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {isRejecting ? "Rejecting..." : "Reject"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function AdminPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const {
    data: pendingProviders = [],
    isLoading: isLoadingPending,
    isError,
  } = usePendingProviders();

  const approveMutation = useApproveProvider();
  const rejectMutation = useRejectProvider();

  const handleApprove = async (provider: ServiceProvider) => {
    try {
      await approveMutation.mutateAsync(provider.id);
      toast.success(`${provider.name} has been approved!`);
    } catch {
      toast.error("Failed to approve provider. Please try again.");
    }
  };

  const handleReject = async (provider: ServiceProvider) => {
    try {
      await rejectMutation.mutateAsync(provider.id);
      toast.success(`${provider.name}'s application has been rejected.`);
    } catch {
      toast.error("Failed to reject provider. Please try again.");
    }
  };

  // Not logged in
  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access the admin panel and manage service provider
            applications.
          </p>
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="gap-2 w-full"
            data-ocid="nav.login_button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? "Connecting..." : "Log In to Continue"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Checking admin status
  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verifying admin access...</span>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have admin permissions. Please contact the platform
            administrator if you believe this is an error.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
                Admin Panel
              </h1>
              <p className="text-white/70 text-sm">
                Review and manage service provider applications
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats bar */}
        <motion.div
          className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-card border border-border/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Pending Applications:{" "}
            <span className="font-bold text-foreground">
              {isLoadingPending ? "..." : pendingProviders.length}
            </span>
          </span>
          {pendingProviders.length > 0 && (
            <Badge className="bg-amber-100 text-amber-700 border border-amber-300 text-xs">
              Needs Attention
            </Badge>
          )}
        </motion.div>

        {/* Error */}
        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load pending providers. Please refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {isLoadingPending ? (
          <AdminSkeleton />
        ) : pendingProviders.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            data-ocid="admin.empty_state"
          >
            <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">
              ✅
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              All Caught Up!
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              There are no pending provider applications at this time. New
              registrations will appear here for review.
            </p>
          </motion.div>
        ) : (
          <div data-ocid="admin.pending_list">
            <AnimatePresence mode="popLayout">
              {pendingProviders.map((provider, idx) => (
                <div key={String(provider.id)} className="mb-4">
                  <PendingProviderRow
                    provider={provider}
                    index={idx}
                    onApprove={() => handleApprove(provider)}
                    onReject={() => handleReject(provider)}
                    isApproving={
                      approveMutation.isPending &&
                      approveMutation.variables === provider.id
                    }
                    isRejecting={
                      rejectMutation.isPending &&
                      rejectMutation.variables === provider.id
                    }
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
