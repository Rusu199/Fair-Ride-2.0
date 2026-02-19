
import React, { useState, useEffect } from 'react';
import {
  MOCK_DRIVERS,
  MOCK_PICKUP,
  MOCK_DROPOFF,
  CUSTOMER_PRESET_MESSAGES,
  DRIVER_PRESET_MESSAGES,
  MOCK_ALL_USERS,
  MOCK_COMPLETED_RIDES,
  MOCK_RESERVATIONS
} from './constants';
import { Driver, RideRequest, LocationInfo, ChatMessage, User, RideStatus, UserStatus, Vehicle, RidePreferences, Location } from './types';
import CustomerHomeScreen from './components/customer/CustomerHomeScreen';
import PriceOfferScreen from './components/customer/PriceOfferScreen';
import WaitingForDriverScreen from './components/customer/WaitingForDriverScreen';
import ActiveRideScreen from './components/customer/ActiveRideScreen';
import DriverDashboard from './components/driver/DriverDashboard';
import ChatScreen from './components/shared/ChatScreen';
import RatingScreen from './components/shared/RatingScreen';
import AdminDashboard from './components/admin/AdminDashboard';
import { Download, X, Moon, Sun, Bell } from 'lucide-react';

type AppScreen =
  | 'customer_home'
  | 'customer_price_offer'
  | 'customer_waiting'
  | 'customer_active_ride'
  | 'customer_chat'
  | 'customer_rating'
  | 'driver_dashboard'
  | 'driver_active_ride'
  | 'driver_chat'
  | 'driver_rating'
  | 'admin_dashboard';

type UserRole = 'customer' | 'driver' | 'admin';

const MOCK_CUSTOMER: User = {
  id: 'customer_1',
  name: 'Sarah C.',
  rating: 4.9,
  photoUrl: 'https://picsum.photos/seed/customer1/100/100',
  status: 'active',
  tripsCompleted: 142
};

function App() {
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('customer_home');
  const [rideRequest, setRideRequest] = useState<RideRequest | null>(null);
  const [rideStatus, setRideStatus] = useState<RideStatus>('none');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'error' } | null>(null);
  
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState<Driver>(drivers[0]); 

  const [allUsers, setAllUsers] = useState<(User | Driver)[]>(MOCK_ALL_USERS);
  const [completedRides, setCompletedRides] = useState<RideRequest[]>(MOCK_COMPLETED_RIDES);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle mock location tracking
  useEffect(() => {
    let watchId: number | null = null;
    if (rideRequest && (rideStatus === 'en_route_to_pickup' || rideStatus === 'in_progress')) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setRideRequest(prev => prev ? {
              ...prev,
              customerLiveLocation: { lat: latitude, lng: longitude }
            } : null);
          },
          (error) => console.error("Location error:", error),
          { enableHighAccuracy: true }
        );
      }
    }
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [rideStatus, !!rideRequest]);

  // Simulate Driver Accepting the offer
  useEffect(() => {
    if (currentScreen === 'customer_waiting' && rideRequest && rideRequest.status === 'pending') {
      const timer = setTimeout(() => {
        const acceptedDriver = drivers.find(d => d.status === 'active') || drivers[0];
        setRideRequest({ ...rideRequest, status: 'accepted', driver: acceptedDriver });
        setRideStatus('en_route_to_pickup');
        setCurrentScreen('customer_active_ride');
        showNotification("Driver Accepted Your Offer!");
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [currentScreen, rideRequest?.status]);

  const showNotification = (message: string, type: 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const resetRideState = () => {
    setRideRequest(null);
    setRideStatus('none');
    setChatMessages([]);
  };

  const handleStartTripConfirm = (pickup: string, destination: string, prefs: RidePreferences) => {
    setRideRequest({
      id: `ride_${Date.now()}`,
      customer: MOCK_CUSTOMER,
      pickupLocation: { ...MOCK_PICKUP, address: pickup },
      dropoffLocation: { ...MOCK_DROPOFF, address: destination },
      additionalStops: [],
      offeredPrice: 0,
      status: 'pending',
      nearbyDrivers: drivers.filter(d => d.status === 'active'),
      createdAt: Date.now(),
      preferences: prefs
    });
    setCurrentScreen('customer_price_offer');
  };

  const handleCompleteRide = () => {
    if (rideRequest && rideRequest.driver) {
        const fare = rideRequest.offeredPrice;
        const driverId = rideRequest.driver.id;
        
        setDrivers(prevDrivers => prevDrivers.map(d => {
            if (d.id === driverId) {
                return { ...d, totalEarnings: (d.totalEarnings || 0) + fare, tripsCompleted: (d.tripsCompleted || 0) + 1 };
            }
            return d;
        }));

        setRideStatus('completed');
        setCurrentScreen(userRole === 'customer' ? 'customer_rating' : 'driver_rating');
    }
  };

  const handleCancelRide = (reason: string = "Trip has been cancelled.") => {
    resetRideState();
    showNotification(reason, 'error');
    setCurrentScreen(userRole === 'customer' ? 'customer_home' : 'driver_dashboard');
  };

  const toggleRole = () => {
    const roles: UserRole[] = ['customer', 'driver', 'admin'];
    const nextRole = roles[(roles.indexOf(userRole) + 1) % roles.length];
    
    let nextScreen: AppScreen = 'customer_home';
    if (nextRole === 'customer') nextScreen = 'customer_home';
    else if (nextRole === 'driver') nextScreen = 'driver_dashboard';
    else if (nextRole === 'admin') nextScreen = 'admin_dashboard';
    
    // Maintain active ride view when switching
    if (rideRequest) {
        if (rideStatus === 'completed') {
            nextScreen = nextRole === 'customer' ? 'customer_rating' : 'driver_rating';
        } else if (rideStatus !== 'none') {
            nextScreen = nextRole === 'customer' ? 'customer_active_ride' : 'driver_active_ride';
        }
    }
    
    setUserRole(nextRole);
    setCurrentScreen(nextScreen);
    showNotification(`Switched to ${nextRole.toUpperCase()} view`);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'customer_home': return <CustomerHomeScreen onConfirmTrip={handleStartTripConfirm} />;
      case 'customer_price_offer': return rideRequest ? <PriceOfferScreen rideRequest={rideRequest} onCreateRideRequest={(price, dist, dur) => { 
          setRideRequest(prev => prev ? {...prev, offeredPrice: price, estimatedDistance: dist, estimatedDuration: dur} : null); 
          setCurrentScreen('customer_waiting'); 
      }} onBack={() => { resetRideState(); setCurrentScreen('customer_home'); }} /> : null;
      case 'customer_waiting': return rideRequest ? <WaitingForDriverScreen rideRequest={rideRequest} onCancel={() => handleCancelRide("You cancelled the request.")} /> : null;
      case 'customer_active_ride': return rideRequest && rideRequest.driver ? <ActiveRideScreen rideRequest={rideRequest} rideStatus={rideStatus} onShowChat={() => setCurrentScreen('customer_chat')} onConfirmPickup={() => setRideStatus('in_progress')} onCompleteRide={handleCompleteRide} onCancelRide={() => handleCancelRide("Trip was cancelled.")} /> : null;
      case 'customer_chat': return rideRequest && rideRequest.driver ? <ChatScreen messages={chatMessages} onSendMessage={(t) => setChatMessages([...chatMessages, { id: Date.now().toString(), rideId: rideRequest.id, senderId: MOCK_CUSTOMER.id, text: t, timestamp: Date.now() }])} onBack={() => setCurrentScreen('customer_active_ride')} currentUserId={MOCK_CUSTOMER.id} otherUser={rideRequest.driver} presets={CUSTOMER_PRESET_MESSAGES} /> : null;
      case 'customer_rating': return rideRequest && rideRequest.driver ? <RatingScreen userToRate={rideRequest.driver} rideDetails={{ pickup: rideRequest.pickupLocation.address, dropoff: rideRequest.dropoffLocation.address }} isRatingDriver={true} onSubmit={() => { resetRideState(); setCurrentScreen('customer_home'); }} /> : null;
      case 'driver_dashboard': return <DriverDashboard 
          driver={selectedDriver} 
          pendingRequest={rideRequest && rideRequest.status === 'pending' && rideRequest.offeredPrice > 0 ? rideRequest : null} 
          reservations={MOCK_RESERVATIONS} 
          onAcceptRide={(d, r) => { 
            setRideRequest({...r, status: 'accepted', driver: d}); 
            setRideStatus('en_route_to_pickup'); 
            setCurrentScreen('driver_active_ride'); 
          }} 
          onStartReservation={(r) => { 
            setRideRequest({...r, status: 'accepted', driver: selectedDriver}); 
            setRideStatus('en_route_to_pickup'); 
            setCurrentScreen('driver_active_ride'); 
          }}
          onDeclineRide={() => resetRideState()} 
        />;
      case 'driver_active_ride': return rideRequest ? <ActiveRideScreen rideRequest={rideRequest} rideStatus={rideStatus} onShowChat={() => setCurrentScreen('driver_chat')} onConfirmPickup={() => setRideStatus('in_progress')} onCompleteRide={handleCompleteRide} onCancelRide={() => handleCancelRide("Trip was cancelled.")} isDriverView /> : null;
      case 'driver_rating': return rideRequest ? <RatingScreen userToRate={rideRequest.customer} rideDetails={{ pickup: rideRequest.pickupLocation.address, dropoff: rideRequest.dropoffLocation.address }} isRatingDriver={false} onSubmit={() => { resetRideState(); setCurrentScreen('driver_dashboard'); }} /> : null;
      case 'driver_chat': return rideRequest && rideRequest.driver ? <ChatScreen messages={chatMessages} onSendMessage={(t) => setChatMessages([...chatMessages, { id: Date.now().toString(), rideId: rideRequest.id, senderId: selectedDriver.id, text: t, timestamp: Date.now() }])} onBack={() => setCurrentScreen('driver_active_ride')} currentUserId={selectedDriver.id} otherUser={rideRequest.customer} presets={DRIVER_PRESET_MESSAGES} /> : null;
      case 'admin_dashboard': return <AdminDashboard drivers={drivers} users={allUsers} rides={completedRides} onUpdateUserStatus={(id, s) => setAllUsers(allUsers.map(u => u.id === id ? {...u, status: s} : u))} onAddDriver={(d) => {
          const newDriver: Driver = {
              ...d, id: Date.now().toString(), rating: 5, photoUrl: 'https://picsum.photos/seed/new/100/100', status: 'active', location: {lat:0,lng:0}, totalEarnings: 0, tripsCompleted: 0, vehicle: {make: d.vehicleMake, model: d.vehicleModel, color: 'N/A', licensePlate: d.licensePlate}
          };
          setDrivers([...drivers, newDriver]);
          setAllUsers([...allUsers, newDriver]);
      }} />;
      default: return <CustomerHomeScreen onConfirmTrip={handleStartTripConfirm} />;
    }
  };

  return (
    <div className={`h-screen w-screen font-sans flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 dark' : 'bg-neutral-light-gray'}`}>
        <div className="relative w-full h-full md:h-[90vh] md:max-w-md md:max-h-[800px] bg-white dark:bg-slate-900 md:shadow-2xl md:rounded-3xl overflow-hidden flex flex-col">
            <div className="absolute top-12 right-2 z-50 flex flex-col gap-2 items-end">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur text-slate-900 dark:text-white rounded-full shadow-lg border border-slate-100 dark:border-slate-700 transition-transform active:scale-90">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={toggleRole} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase rounded-full shadow-xl border border-white/20 dark:border-slate-200 transition-all hover:scale-105 active:scale-95">
                    Mode: {userRole}
                </button>
            </div>

            {notification && (
              <div className="absolute top-24 left-4 right-4 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${notification.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 'bg-primary-blue/90 border-blue-400 text-white'}`}>
                  <Bell size={18} className="animate-ring" />
                  <p className="text-xs font-black uppercase tracking-tight">{notification.message}</p>
                </div>
              </div>
            )}
            
            <div className="flex-grow h-full overflow-hidden relative pt-10">
                 {renderScreen()}
            </div>
        </div>
    </div>
  );
}

export default App;
