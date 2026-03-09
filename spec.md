# help

## Current State

ServiceConnect (now "help") is a service provider directory with:
- Landing page with service categories
- Browse page to search/filter approved providers
- Register page for provider self-registration
- Admin page for approving/rejecting pending registrations

Backend has: `ServiceProvider`, `ServiceCategory`, `ProviderStatus` types and CRUD functions. Authorization (admin/user/guest roles) is enabled.

## Requested Changes (Diff)

### Add
- `Review` type in backend: id, providerId, reviewerName, rating (1-5), comment, createdAt
- `submitReview(providerId, reviewerName, rating, comment)` -- public, no auth required
- `getReviewsForProvider(providerId)` -- public query returning all reviews for a provider
- `getAverageRating(providerId)` -- public query returning average star rating
- Review form UI on provider detail view (in BrowsePage) with: reviewer name, star rating (1-5), comment textarea, submit button
- Reviews list displayed beneath provider details showing star rating, reviewer name, comment, date
- Average rating badge shown on provider cards in the browse grid

### Modify
- BrowsePage: Add reviews section to provider detail panel/modal; show average star rating on provider cards

### Remove
- Nothing

## Implementation Plan

1. Add `Review` type and review map (`nextReviewId` counter) to `main.mo`
2. Add `submitReview`, `getReviewsForProvider`, `getAverageRating` functions to `main.mo`
3. Update `backend.d.ts` with new `Review` type and function signatures
4. Update BrowsePage to show average star rating on provider cards
5. Add review submission form and reviews list to provider detail view
