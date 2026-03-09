import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Review, ServiceCategory, ServiceProvider } from "../backend";
import { useActor } from "./useActor";

// ─────────────────────────────────────────────
// Query: Get approved providers
// ─────────────────────────────────────────────
export function useApprovedProviders() {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceProvider[]>({
    queryKey: ["approvedProviders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedProviders();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─────────────────────────────────────────────
// Query: Search providers
// ─────────────────────────────────────────────
export function useSearchProviders(
  category: ServiceCategory | null,
  location: string | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceProvider[]>({
    queryKey: ["searchProviders", category, location],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProviders(category, location);
    },
    enabled: !!actor && !isFetching,
  });
}

// ─────────────────────────────────────────────
// Query: Pending providers (admin)
// ─────────────────────────────────────────────
export function usePendingProviders() {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceProvider[]>({
    queryKey: ["pendingProviders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPendingProviders();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─────────────────────────────────────────────
// Query: Is caller admin
// ─────────────────────────────────────────────
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─────────────────────────────────────────────
// Mutation: Register provider
// ─────────────────────────────────────────────
export function useRegisterProvider() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      category: ServiceCategory;
      yearsExperience: number;
      location: string;
      availability: string;
      bio: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerProvider(
        data.name,
        data.email,
        data.phone,
        data.category,
        BigInt(data.yearsExperience),
        data.location,
        data.availability,
        data.bio,
      );
    },
  });
}

// ─────────────────────────────────────────────
// Mutation: Approve provider
// ─────────────────────────────────────────────
export function useApproveProvider() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveProvider(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingProviders"] });
      queryClient.invalidateQueries({ queryKey: ["approvedProviders"] });
    },
  });
}

// ─────────────────────────────────────────────
// Mutation: Reject provider
// ─────────────────────────────────────────────
export function useRejectProvider() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectProvider(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingProviders"] });
    },
  });
}

// ─────────────────────────────────────────────
// Query: Reviews for a provider
// ─────────────────────────────────────────────
export function useReviewsForProvider(providerId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", providerId?.toString() ?? "null"],
    queryFn: async () => {
      if (!actor || providerId === null) return [];
      return actor.getReviewsForProvider(providerId);
    },
    enabled: !!actor && !isFetching && providerId !== null,
  });
}

// ─────────────────────────────────────────────
// Query: Average rating for a provider
// ─────────────────────────────────────────────
export function useAverageRating(providerId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint | null>({
    queryKey: ["averageRating", providerId?.toString() ?? "null"],
    queryFn: async () => {
      if (!actor || providerId === null) return null;
      return actor.getAverageRating(providerId);
    },
    enabled: !!actor && !isFetching && providerId !== null,
  });
}

// ─────────────────────────────────────────────
// Mutation: Submit a review
// ─────────────────────────────────────────────
export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      providerId: bigint;
      reviewerName: string;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitReview(
        data.providerId,
        data.reviewerName,
        data.rating,
        data.comment,
      );
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.providerId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["averageRating", variables.providerId.toString()],
      });
    },
  });
}
