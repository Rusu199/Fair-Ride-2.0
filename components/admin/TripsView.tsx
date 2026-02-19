import React from 'react';
import { RideRequest } from '../../types';
import { Clock, User, DollarSign } from 'lucide-react';

interface TripsViewProps {
  rides: RideRequest[];
}

const TripsView: React.FC<TripsViewProps> = ({ rides }) => {
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }

  return (
    <div className="p-4 space-y-3">
        <h2 className="text-lg font-bold text-neutral-dark-gray dark:text-white mb-2">Completed Trips ({rides.length})</h2>
      {rides.length === 0 ? (
        <p className="text-neutral-medium-gray dark:text-slate-500 text-center mt-8 italic">No completed trips yet.</p>
      ) : (
        [...rides].sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0)).map(ride => (
          <div key={ride.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black text-neutral-medium-gray dark:text-slate-500 uppercase tracking-widest">
                    ID: {ride.id.substring(ride.id.length - 6)}
                </p>
                <div className="flex items-center text-[10px] font-black text-neutral-medium-gray dark:text-slate-500 uppercase tracking-widest">
                    <Clock size={12} className="mr-1" />
                    <span>{formatDate(ride.completedAt || ride.createdAt)}</span>
                </div>
            </div>
            <p className="font-bold text-sm leading-tight mb-3 text-neutral-dark-gray dark:text-slate-200">
                {ride.pickupLocation.address} <span className="text-primary-blue mx-1">→</span> {ride.dropoffLocation.address}
            </p>
            <div className="border-t dark:border-slate-800 pt-3 flex justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-neutral-dark-gray dark:text-slate-400">
                        <User size={14} className="mr-1.5 text-blue-500"/>
                        <span className="text-xs font-bold">{ride.customer.name}</span>
                    </div>
                     <div className="flex items-center text-neutral-dark-gray dark:text-slate-400">
                        <User size={14} className="mr-1.5 text-green-500"/>
                        <span className="text-xs font-bold">{ride.driver?.name || 'N/A'}</span>
                    </div>
                </div>
                <div className="flex items-center font-black text-primary-green">
                    <span className="font-sans mr-0.5">£</span>
                    <span>{ride.offeredPrice.toFixed(2)}</span>
                </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TripsView;