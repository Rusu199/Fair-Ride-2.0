import React from 'react';
import { RideRequest } from '../../types';
import Button from '../shared/Button';
import Rating from '../shared/Rating';
import { DollarSign, Loader2, Info } from 'lucide-react';

interface WaitingForDriverScreenProps {
  rideRequest: RideRequest;
  onCancel: () => void;
}

const WaitingForDriverScreen: React.FC<WaitingForDriverScreenProps> = ({ rideRequest, onCancel }) => {
  return (
    <div className="flex flex-col h-full bg-neutral-light-gray p-4 overflow-y-auto">
      <div className="text-center py-10">
        <div className="flex justify-center mb-6">
             <div className="relative">
                <Loader2 size={72} className="animate-spin text-primary-blue opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <DollarSign size={28} className="text-primary-blue animate-bounce" />
                </div>
             </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Finding Your Ride</h1>
        <p className="text-neutral-medium-gray text-sm font-medium mt-1">Broadcasting your offer to local drivers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 text-center">
        <div className="mb-4">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Your Offered Price</p>
            <p className="text-4xl font-black text-slate-900">£{rideRequest.offeredPrice.toFixed(2)}</p>
        </div>
        
        <div className="flex items-start gap-3 px-1 text-left border-t border-gray-50 pt-4">
            <Info size={16} className="text-primary-blue mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">Drivers see your offer and can choose to accept. Payment is handled directly at the start of the trip.</p>
        </div>
      </div>

      <div className="flex-grow px-1">
        <h2 className="text-[10px] font-black text-neutral-medium-gray mb-4 uppercase tracking-[0.25em]">Drivers Nearby</h2>
        <div className="space-y-4">
          {rideRequest.nearbyDrivers.slice(0, 3).map((driver) => (
            <div key={driver.id} className="bg-white rounded-2xl shadow-sm border border-gray-50 p-3.5 flex items-center space-x-4">
              <div className="relative">
                <img src={driver.photoUrl} alt={driver.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div className="absolute -bottom-1 -right-1 bg-primary-green w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <p className="font-black text-slate-900 text-sm">{driver.name}</p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <Rating value={driver.rating} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{driver.tripsCompleted || 0} TRIPS</span>
                </div>
                <p className="text-[10px] font-black text-primary-blue mt-1 uppercase tracking-widest">{driver.vehicle.make} {driver.vehicle.model}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-6">
        <Button variant="secondary" onClick={onCancel} className="rounded-2xl border-2 border-gray-200 text-gray-400 font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
          Cancel Request
        </Button>
      </div>
    </div>
  );
};

export default WaitingForDriverScreen;