import React, { useEffect, useState } from 'react';
import { RideRequest, Driver } from '../../types';
import Button from '../shared/Button';
import Rating from '../shared/Rating';
import { MapPin, Navigation } from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../../utils/location';

interface RideRequestScreenProps {
  request: RideRequest;
  driver: Driver;
  onAccept: (driver: Driver, request: RideRequest) => void;
  onDecline: (driver: Driver, request: RideRequest) => void;
}

const RideRequestScreen: React.FC<RideRequestScreenProps> = ({ request, driver, onAccept, onDecline }) => {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      onDecline(driver, request);
    }
  }, [timer, onDecline, driver, request]);

  return (
    <div className="flex flex-col h-full bg-neutral-dark-gray text-white p-4 justify-between">
      <div>
        <div className="text-center my-8">
            <div 
                className="w-24 h-24 mx-auto rounded-full border-4 border-primary-orange flex items-center justify-center text-4xl font-bold"
                style={{borderColor: timer > 10 ? '#F59E0B' : '#DC2626'}}
            >
                {timer}
            </div>
            <p className="mt-4 text-neutral-light-gray">New Ride Request</p>
        </div>

        {/* Customer Info */}
        <div className="bg-white/10 p-4 rounded-lg flex items-center space-x-4 mb-4">
          <img src={request.customer.photoUrl} alt={request.customer.name} className="w-14 h-14 rounded-full" />
          <div className="flex-grow">
            <p className="font-bold text-lg">{request.customer.name}</p>
            <Rating value={request.customer.rating} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-green">${request.offeredPrice.toFixed(2)}</p>
            <p className="text-xs text-neutral-light-gray">Customer's Offer</p>
          </div>
        </div>
        
        {/* Trip Details */}
        <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-start space-x-3 mb-4">
                <MapPin size={20} className="text-neutral-light-gray mt-1 flex-shrink-0"/>
                <div>
                    <div className="text-xs text-gray-400">PICKUP</div>
                    <p className="font-medium leading-tight">{request.pickupLocation.address}</p>
                </div>
            </div>
            <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary-blue mt-1 flex-shrink-0"/>
                 <div>
                    <div className="text-xs text-gray-400">DROPOFF</div>
                    <p className="font-medium leading-tight">{request.dropoffLocation.address}</p>
                </div>
            </div>
            <a 
                href={getGoogleMapsDirectionsUrl(request.pickupLocation.coordinates)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 w-full h-11 rounded-lg font-medium text-sm transition-transform active:scale-[0.98] flex items-center justify-center bg-sky-500 text-white"
            >
                <Navigation size={18} className="mr-2" />
                Navigate to Pickup
            </a>
        </div>
      </div>
      
      <div className="flex space-x-4 pb-4">
        <Button variant="destructive" onClick={() => onDecline(driver, request)}>Decline</Button>
        <Button className="bg-primary-green hover:bg-green-700" onClick={() => onAccept(driver, request)}>Accept</Button>
      </div>
    </div>
  );
};

export default RideRequestScreen;