
import { Driver, LocationInfo, User, RideRequest } from './types';

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'driver_1',
    name: 'John D.',
    rating: 4.8,
    photoUrl: 'https://picsum.photos/seed/driver1/100/100',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      color: 'Silver',
      licensePlate: 'B7U-221',
    },
    location: { lat: 34.08, lng: -118.24 },
    status: 'active',
    totalEarnings: 2450.50,
    tripsCompleted: 156
  },
  {
    id: 'driver_2',
    name: 'Maria S.',
    rating: 4.9,
    photoUrl: 'https://picsum.photos/seed/driver2/100/100',
    vehicle: {
      make: 'Honda',
      model: 'Accord',
      color: 'Black',
      licensePlate: 'C9A-456',
    },
    location: { lat: 34.07, lng: -118.25 },
    status: 'active',
    totalEarnings: 3120.00,
    tripsCompleted: 204
  },
  {
    id: 'driver_3',
    name: 'Kenji T.',
    rating: 4.7,
    photoUrl: 'https://picsum.photos/seed/driver3/100/100',
    vehicle: {
      make: 'Tesla',
      model: 'Model 3',
      color: 'White',
      licensePlate: 'E4V-789',
    },
    location: { lat: 34.06, lng: -118.23 },
    status: 'suspended',
    totalEarnings: 150.25,
    tripsCompleted: 12
  },
];

export const MOCK_PICKUP: LocationInfo = {
  address: 'Dodger Stadium, Los Angeles',
  coordinates: { lat: 34.0739, lng: -118.2398 },
};

export const MOCK_DROPOFF: LocationInfo = {
  address: 'Santa Monica Pier, Santa Monica',
  coordinates: { lat: 34.0086, lng: -118.4988 },
};


export const CUSTOMER_PRESET_MESSAGES = [
  "I'm at the pickup location.",
  "I'll be right there.",
  "Can you see me?",
  "Sorry, I'm running a few minutes late.",
  "Thank you for waiting!",
];

export const DRIVER_PRESET_MESSAGES = [
  "I've arrived.",
  "I'm just around the corner.",
  "I'm stuck in traffic, my ETA might be a bit longer.",
  "Okay, sounds good.",
  "See you in a minute!",
];

const MOCK_CUSTOMER_USER: User = {
    id: 'customer_1',
    name: 'Sarah C.',
    rating: 4.9,
    photoUrl: 'https://picsum.photos/seed/customer1/100/100',
    status: 'active',
};

const MOCK_CUSTOMER_USER_2: User = {
    id: 'customer_2',
    name: 'Mike R.',
    rating: 4.5,
    photoUrl: 'https://picsum.photos/seed/customer2/100/100',
    status: 'active',
};

const MOCK_CUSTOMER_USER_3: User = {
    id: 'customer_3',
    name: 'Emily B.',
    rating: 3.2,
    photoUrl: 'https://picsum.photos/seed/customer3/100/100',
    status: 'banned',
};


export const MOCK_ALL_USERS: (User | Driver)[] = [
    MOCK_CUSTOMER_USER,
    MOCK_CUSTOMER_USER_2,
    MOCK_CUSTOMER_USER_3,
    ...MOCK_DRIVERS,
];

export const MOCK_COMPLETED_RIDES: RideRequest[] = [
    {
        id: 'ride_1',
        customer: MOCK_CUSTOMER_USER_2,
        driver: MOCK_DRIVERS[1],
        pickupLocation: MOCK_PICKUP,
        dropoffLocation: { address: 'Griffith Observatory', coordinates: { lat: 34.1184, lng: -118.3004 }},
        // Fix: added missing required additionalStops property
        additionalStops: [],
        offeredPrice: 22.50,
        status: 'completed',
        createdAt: Date.now() - 3600000,
        completedAt: Date.now() - 1800000,
        nearbyDrivers: [],
        preferences: {
            quietRide: false,
            acOn: true,
            luggage: false,
            passengerCount: 1,
            vehicleClass: 'standard'
        },
    }
];

export const MOCK_RESERVATIONS: RideRequest[] = [
    {
        id: 'rsv_1',
        customer: MOCK_CUSTOMER_USER,
        pickupLocation: { address: 'Hollywood Sign', coordinates: { lat: 34.1341, lng: -118.3215 } },
        dropoffLocation: MOCK_DROPOFF,
        // Fix: added missing required additionalStops property
        additionalStops: [],
        offeredPrice: 35.00,
        status: 'pending',
        nearbyDrivers: [],
        createdAt: Date.now(),
        preferences: {
            quietRide: true,
            acOn: true,
            luggage: true,
            passengerCount: 2,
            vehicleClass: 'premium',
            scheduledTime: 'Today at 18:00'
        },
    }
];
