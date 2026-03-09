import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type OldActor = {
    nextProviderId : Nat;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    providers : Map.Map<Nat, ServiceProvider>;
  };

  public type OldUserProfile = {
    name : Text;
  };

  public type ServiceProvider = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    category : ServiceCategory;
    yearsExperience : Nat;
    location : Text;
    availability : Text;
    bio : Text;
    status : ProviderStatus;
    registeredAt : Int;
  };

  public type ServiceCategory = {
    #nurse;
    #plumber;
    #electrician;
    #carpenter;
    #cleaner;
    #painter;
    #hvac;
    #other;
  };

  public type ProviderStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type NewActor = {
    nextProviderId : Nat;
    nextReviewId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    providers : Map.Map<Nat, ServiceProvider>;
    reviews : Map.Map<Nat, Review>;
  };

  public type UserProfile = {
    name : Text;
  };

  public type Review = {
    id : Nat;
    providerId : Nat;
    reviewerName : Text;
    rating : Nat;
    comment : Text;
    createdAt : Int;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      nextReviewId = 1; // Start reviews at 1
      reviews = Map.empty<Nat, Review>();
    };
  };
};
