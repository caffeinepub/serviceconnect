import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    id: bigint;
    createdAt: bigint;
    reviewerName: string;
    comment: string;
    rating: bigint;
    providerId: bigint;
}
export interface ServiceProvider {
    id: bigint;
    bio: string;
    status: ProviderStatus;
    yearsExperience: bigint;
    name: string;
    email: string;
    availability: string;
    category: ServiceCategory;
    phone: string;
    registeredAt: bigint;
    location: string;
}
export interface UserProfile {
    name: string;
}
export enum ProviderStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum ServiceCategory {
    plumber = "plumber",
    other = "other",
    hvac = "hvac",
    electrician = "electrician",
    nurse = "nurse",
    cleaner = "cleaner",
    painter = "painter",
    carpenter = "carpenter"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveProvider(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getApprovedProviders(): Promise<Array<ServiceProvider>>;
    getAverageRating(providerId: bigint): Promise<bigint | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProvider(id: bigint): Promise<ServiceProvider | null>;
    getReviewsForProvider(providerId: bigint): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listPendingProviders(): Promise<Array<ServiceProvider>>;
    registerProvider(name: string, email: string, phone: string, category: ServiceCategory, yearsExperience: bigint, location: string, availability: string, bio: string): Promise<bigint>;
    rejectProvider(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProviders(category: ServiceCategory | null, location: string | null): Promise<Array<ServiceProvider>>;
    submitReview(providerId: bigint, reviewerName: string, rating: bigint, comment: string): Promise<bigint>;
}
