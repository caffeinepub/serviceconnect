# ServiceConnect

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Service provider registration: name, contact info, service category (medical/nurse, plumbing, electrical, carpentry, cleaning, etc.), years of experience, location/area served, availability, and a short bio
- Public directory: anyone can browse and search registered service providers by category or location
- Provider profile page: shows all provider details plus a contact button
- Admin-like view for managing/listing providers (optional: basic review status)
- Sample service categories: Medical Nurse, Plumber, Electrician, Carpenter, House Cleaning, Painter, HVAC Technician

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- `ServiceCategory` variant: Nurse, Plumber, Electrician, Carpenter, Cleaner, Painter, HVAC, Other
- `ProviderStatus` variant: Pending, Approved, Rejected
- `ServiceProvider` record: id, name, email, phone, category, yearsExperience, location, availability, bio, status, registeredAt
- `registerProvider(input)` -> returns new provider id
- `getProviders()` -> returns all approved providers
- `getProviderById(id)` -> returns single provider
- `searchProviders(category, location)` -> filtered list
- `getPendingProviders()` -> admin: list pending registrations
- `updateProviderStatus(id, status)` -> admin: approve/reject
- Stable storage for providers map

### Frontend
- Landing page: hero section explaining the platform, CTA to register or browse
- Browse/Search page: filter by category and location, grid of provider cards
- Provider detail page/modal: full profile with contact info
- Register page: multi-field form for provider self-registration
- Admin page (accessible by canister owner): list pending providers, approve/reject buttons
- Responsive layout with navigation
