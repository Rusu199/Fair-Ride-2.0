
import React, { useState } from 'react';
import { RideRequest, RideStatus } from '../../types';
import Header from '../shared/Header';
import Button from '../shared/Button';
import Rating from '../shared/Rating';
import Map, { MarkerInfo } from '../shared/Map';
import { MessageSquare, Phone, Shield, Navigation, X, Share2, AlertCircle, XCircle } from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../../utils/location';

interface ActiveRideScreenProps {
  rideRequest: RideRequest;
  rideStatus: RideStatus;
  onShowChat: () => void;
  onConfirmPickup: () => void;
  onCompleteRide: () => void;
  onCancelRide: () => void;
  isDriverView?: boolean;
}

const ActiveRideScreen: React.FC<ActiveRideScreenProps> = ({ 
  rideRequest, 
  rideStatus, 
  onShowChat, 
  onConfirmPickup, 
  onCompleteRide, 
  onCancelRide,
  isDriverView = false 
}) => {
  const [showSafetyTools, setShowSafetyTools] = useState(false);
  const { driver, customer, pickupLocation, dropoffLocation, customerLiveLocation } = rideRequest;
  const targetUser = isDriverView ? customer : driver;

  if (!driver) return null;

  const getTripStatusText = () => {
    if (isDriverView) {
      switch (rideStatus) {
        case 'en_route_to_pickup': return `Picking up ${customer.name}`;
        case 'in_progress': return `Dropping off ${customer.name}`;
        default: return "Ride in Progress";
      }
    } else {
      switch (rideStatus) {
        case 'en_route_to_pickup': return `${driver.name} is arriving`;
        case 'in_progress': return `On your way to destination`;
        default: return "Enjoy your ride!";
      }
    }
  };

  const markers: MarkerInfo[] = [
    { position: pickupLocation.coordinates, type: 'pickup', popupContent: 'Pickup Spot' },
    { position: dropoffLocation.coordinates, type: 'dropoff', popupContent: 'Dropoff Spot' },
    { position: driver.location, type: 'driver', popupContent: driver.name }
  ];

  if (customerLiveLocation && isDriverView && rideStatus === 'en_route_to_pickup') {
    markers.push({ 
        position: customerLiveLocation, 
        type: 'customer_live', 
        popupContent: `${customer.name}'s current position` 
    });
  }

  const getNavigationUrl = () => {
    if (isDriverView) {
      return rideStatus === 'en_route_to_pickup'
        ? getGoogleMapsDirectionsUrl(pickupLocation.coordinates)
        : getGoogleMapsDirectionsUrl(dropoffLocation.coordinates);
    }
    return getGoogleMapsDirectionsUrl(pickupLocation.coordinates);
  };

  return (
    <div className="flex flex-col h-full relative">
      <Header title={getTripStatusText()} />
      
      <div className="flex-grow z-0 relative">
        <Map 
            center={rideStatus === 'in_progress' ? dropoffLocation.coordinates : driver.location} 
            zoom={15} 
            markers={markers}
            route={[pickupLocation.coordinates, dropoffLocation.coordinates]}
        />

        <div className="absolute top-4 left-4 z-[100] flex flex-col gap-2">
            {!isDriverView && (
                <button 
                    onClick={() => setShowSafetyTools(true)}
                    className="bg-white dark:bg-slate-800 text-status-error p-3 rounded-full shadow-2xl border border-red-50 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <Shield size={24}/>
                </button>
            )}
            <button 
                onClick={onCancelRide}
                className="bg-white dark:bg-slate-800 text-slate-400 p-3 rounded-full shadow-2xl border border-gray-100 dark:border-slate-700 hover:text-status-error transition-colors"
                title="Cancel Ride"
            >
                <XCircle size={24}/>
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 shadow-2xl rounded-t-[32px] border-t dark:border-slate-800 relative z-10 -mt-8">
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full mx-auto mb-5"></div>
        
        <div className="flex items-center space-x-4 mb-5">
          <img src={targetUser?.photoUrl} alt={targetUser?.name} className="w-16 h-16 rounded-2xl border-2 border-primary-blue/5 object-cover shadow-sm" />
          <div className="flex-grow">
            <p className="font-black text-gray-900 dark:text-white leading-tight">{targetUser?.name}</p>
            <div className="flex items-center gap-2 mt-1">
                <Rating value={targetUser?.rating || 0} />
                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">• {targetUser?.tripsCompleted || 0} TRIPS</span>
            </div>
          </div>
          <div className="flex space-x-2">
              <button onClick={onShowChat} className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary-blue flex items-center justify-center shadow-sm">
                  <MessageSquare size={22}/>
              </button>
              <button className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary-blue flex items-center justify-center shadow-sm">
                  <Phone size={22}/>
              </button>
          </div>
        </div>

        {driver.vehicle && !isDriverView && (
          <div className="bg-gray-50/80 dark:bg-slate-800/50 p-4 rounded-2xl flex justify-between items-center mb-5 border border-gray-100 dark:border-slate-800">
            <div>
              <p className="font-black text-sm text-gray-900 dark:text-white">{driver.vehicle.make} {driver.vehicle.model}</p>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase">{driver.vehicle.color}</p>
            </div>
            <div className="bg-slate-900 dark:bg-slate-700 text-white font-black text-xs px-3 py-1.5 rounded-xl tracking-widest">
                {driver.vehicle.licensePlate}
            </div>
          </div>
        )}

         {(isDriverView || rideStatus === 'en_route_to_pickup') && (
            <a 
                href={getNavigationUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mb-5 w-full h-12 rounded-2xl font-black uppercase text-xs tracking-[0.15em] flex items-center justify-center bg-sky-500 text-white shadow-xl shadow-sky-200 dark:shadow-sky-900/20 transition-transform active:scale-95"
            >
                <Navigation size={18} className="mr-2" />
                Navigate {rideStatus === 'en_route_to_pickup' ? 'to Pickup' : 'to Dropoff'}
            </a>
         )}

        {isDriverView && rideStatus === 'en_route_to_pickup' && (
            <Button onClick={onConfirmPickup} className="rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-primary-blue/20">
                Confirm Pickup
            </Button>
        )}
        
        {isDriverView && rideStatus === 'in_progress' && (
            <Button onClick={onCompleteRide} className="bg-primary-green hover:bg-green-700 rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-primary-green/20">
                Complete Ride
            </Button>
        )}

        {!isDriverView && (
             <div className="mt-4 pt-4 flex flex-col gap-3 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Agreed Direct Fare:</p>
                    <p className="font-black text-gray-900 dark:text-white text-lg">£{rideRequest.offeredPrice.toFixed(2)}</p>
                </div>
                {isDriverView && customerLiveLocation && (
                    <div className="flex items-center gap-3 bg-green-50/50 dark:bg-green-900/10 p-3 rounded-2xl border border-green-50 dark:border-green-900/20">
                        <Navigation size={18} className="text-primary-green flex-shrink-0 animate-pulse"/>
                        <p className="text-[11px] text-primary-green dark:text-green-400 font-bold leading-tight">Live customer tracking active. Blue dot shows passenger location.</p>
                    </div>
                )}
                {!isDriverView && (
                    <div className="flex items-center gap-3 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-2xl border border-blue-50 dark:border-blue-900/20">
                        <AlertCircle size={18} className="text-primary-blue flex-shrink-0"/>
                        <p className="text-[11px] text-primary-blue dark:text-blue-400 font-bold leading-tight">Pay your driver at the start of the trip.</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {showSafetyTools && (
          <div className="absolute inset-0 z-[200] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-sm p-8 flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-status-error uppercase tracking-tighter">Safety Hub</h2>
                    <button onClick={() => setShowSafetyTools(false)} className="p-3 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-900 dark:text-white"><X size={24}/></button>
                </div>
                
                <div className="space-y-4">
                    <button className="w-full flex items-center p-5 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
                        <Share2 className="text-primary-blue mr-5" size={28}/>
                        <div className="text-left">
                            <p className="font-black text-gray-900 dark:text-white text-sm">Share Trip Details</p>
                            <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mt-0.5">Send live map link to family</p>
                        </div>
                    </button>

                     <button className="w-full flex items-center p-5 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-100 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">
                        <AlertCircle className="text-status-error mr-5" size={28}/>
                        <div className="text-left">
                            <p className="font-black text-status-error text-sm">Emergency Alert</p>
                            <p className="text-xs font-semibold text-red-400 mt-0.5">Call emergency services</p>
                        </div>
                    </button>
                </div>

                <p className="mt-10 text-center text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">FairRide Safety Shield Active</p>
            </div>
          </div>
      )}
    </div>
  );
};

export default ActiveRideScreen;
