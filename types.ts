
export type UserStatus = 'active' | 'suspended' | 'banned';
export type VehicleClass = 'standard' | 'xl' | 'premium' | 'premium_xl';

export interface Location {
  lat: number;
  lng: number;
}

export interface LocationInfo {
  address: string;
  coordinates: Location;
}

export interface User {
  id: string;
  name: string;
  rating: number;
  photoUrl: string;
  status: UserStatus;
  tripsCompleted?: number;
}

export interface Vehicle {
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  year?: string;
  seats?: number;
}

export interface Driver extends User {
  vehicle: Vehicle;
  location: Location;
  languages?: string[];
  totalEarnings?: number;
}

export interface SuggestedPrice {
    min: number;
    max: number;
    average: number;
    distance?: string;
    duration?: string;
}

export type RideStatus = 'none' | 'en_route_to_pickup' | 'arrived_at_pickup' | 'in_progress' | 'completed';

export interface RidePreferences {
    quietRide: boolean;
    acOn: boolean;
    luggage: boolean;
    passengerCount: number;
    vehicleClass: VehicleClass;
    scheduledTime?: string;
}

export interface RideRequest {
  id: string;
  customer: User;
  pickupLocation: LocationInfo;
  dropoffLocation: LocationInfo;
  additionalStops: LocationInfo[];
  customerLiveLocation?: Location;
  offeredPrice: number;
  estimatedDistance?: string;
  estimatedDuration?: string;
  preferences: RidePreferences;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  nearbyDrivers: Driver[];
  driver?: Driver;
  createdAt: number;
  completedAt?: number;
}

export interface ChatMessage {
    id: string;
    rideId: string;
    senderId: string;
    text: string;
    timestamp: number;
}
