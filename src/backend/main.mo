import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile type
  public type UserProfile = {
    name : Text;
  };

  // User profiles map
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ID counter
  var nextProviderId = 1;

  // Service categories
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

  // Provider status
  public type ProviderStatus = {
    #pending;
    #approved;
    #rejected;
  };

  // Provider record
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

  // Stable map for providers
  let providers = Map.empty<Nat, ServiceProvider>();

  // Comparison functions
  module ServiceProvider {
    public func compare(a : ServiceProvider, b : ServiceProvider) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // Core functions

  // Any user can register as a service provider
  public shared ({ caller }) func registerProvider(
    name : Text,
    email : Text,
    phone : Text,
    category : ServiceCategory,
    yearsExperience : Nat,
    location : Text,
    availability : Text,
    bio : Text,
  ) : async Nat {
    let id = nextProviderId;
    let provider : ServiceProvider = {
      id;
      name;
      email;
      phone;
      category;
      yearsExperience;
      location;
      availability;
      bio;
      status = #pending;
      registeredAt = Time.now();
    };
    providers.add(id, provider);
    nextProviderId += 1;
    id;
  };

  // Any user can get a provider by id
  public query ({ caller }) func getProvider(id : Nat) : async ?ServiceProvider {
    providers.get(id);
  };

  // Any user can browse all approved providers
  public query ({ caller }) func getApprovedProviders() : async [ServiceProvider] {
    providers.values().toArray().filter(func(p) { p.status == #approved });
  };

  // Any user can search/filter providers by category and/or location
  public query ({ caller }) func searchProviders(
    category : ?ServiceCategory,
    location : ?Text,
  ) : async [ServiceProvider] {
    providers.values().toArray().filter(
      func(p) {
        switch (category, location) {
          case (?cat, ?loc) {
            p.status == #approved and p.category == cat and p.location.contains(#text loc);
          };
          case (?cat, null) {
            p.status == #approved and p.category == cat;
          };
          case (null, ?loc) {
            p.status == #approved and p.location.contains(#text loc);
          };
          case (null, null) {
            p.status == #approved;
          };
        };
      }
    );
  };

  // Admin only: list all pending providers
  public query ({ caller }) func listPendingProviders() : async [ServiceProvider] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list pending providers");
    };
    providers.values().toArray().filter(func(p) { p.status == #pending });
  };

  // Admin only: approve a provider by id
  public shared ({ caller }) func approveProvider(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve providers");
    };
    switch (providers.get(id)) {
      case (?provider) {
        let updatedProvider : ServiceProvider = {
          id = provider.id;
          name = provider.name;
          email = provider.email;
          phone = provider.phone;
          category = provider.category;
          yearsExperience = provider.yearsExperience;
          location = provider.location;
          availability = provider.availability;
          bio = provider.bio;
          status = #approved;
          registeredAt = provider.registeredAt;
        };
        providers.add(id, updatedProvider);
      };
      case null {
        Runtime.trap("Provider not found");
      };
    };
  };

  // Admin only: reject a provider by id
  public shared ({ caller }) func rejectProvider(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject providers");
    };
    switch (providers.get(id)) {
      case (?provider) {
        let updatedProvider : ServiceProvider = {
          id = provider.id;
          name = provider.name;
          email = provider.email;
          phone = provider.phone;
          category = provider.category;
          yearsExperience = provider.yearsExperience;
          location = provider.location;
          availability = provider.availability;
          bio = provider.bio;
          status = #rejected;
          registeredAt = provider.registeredAt;
        };
        providers.add(id, updatedProvider);
      };
      case null {
        Runtime.trap("Provider not found");
      };
    };
  };
};
