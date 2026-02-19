import React, { useState } from 'react';
import { Driver, RideRequest } from '../../types';
import Header from '../shared/Header';
import Rating from '../shared/Rating';
import { MapPin, TrendingUp, DollarSign, Award, Check, X, Clock, Navigation2, Calendar, Users, Bell } from 'lucide-react';

interface DriverDashboardProps {
  driver: Driver;
  pendingRequest: RideRequest | null;
  reservations: RideRequest[];
  onAcceptRide: (driver: Driver, request: RideRequest) => void;
  onStartReservation: (request: RideRequest) => void;
  onDeclineRide: (request: RideRequest) => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ 
  driver, 
  pendingRequest, 
  reservations, 
  onAcceptRide, 
  onStartReservation, 
  onDeclineRide 
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'rsv'>('status');

  const handleAccept = (req: RideRequest) => {
    onAcceptRide(driver, req);
  };

  const handleDecline = (req: RideRequest) => {
    onDeclineRide(req);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-light-gray dark:bg-slate-950">
      <Header title="Driver Dashboard" />
      
      <div className="flex bg-white dark:bg-slate-900 border-b dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === 'status' ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-slate-400'}`}
          >
              Earnings & Offers
          </button>
          <button 
            onClick={() => setActiveTab('rsv')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === 'rsv' ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-slate-400'}`}
          >
              Reservations
              {reservations.length > 0 && <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {activeTab === 'status' ? (
          <>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lifetime Earnings</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">£{driver.totalEarnings?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl text-primary-green">
                        <TrendingUp size={24}/>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary-blue">
                            <Award size={18}/>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white">{driver.tripsCompleted || 0}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Trips Done</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-primary-orange">
                            <DollarSign size={18}/>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white">£{driver.tripsCompleted && driver.tripsCompleted > 0 ? ( (driver.totalEarnings || 0) / driver.tripsCompleted ).toFixed(2) : '0.00'}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Avg / Trip</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center text-center px-4 py-4">
                {!pendingRequest && (
                    <>
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                            <div className="w-3 h-3 bg-primary-blue rounded-full animate-ping"></div>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Status: Online</h2>
                        <p className="text-neutral-medium-gray dark:text-slate-400 text-xs font-medium mt-1">Waiting for nearby trip offers...</p>
                    </>
                )}
                
                {pendingRequest && (
                    <div className="w-full bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl relative overflow-hidden ring-4 ring-primary-blue/20">
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-5">
                                <span className="px-3 py-1 bg-primary-green text-white text-[10px] font-black rounded-full tracking-widest animate-pulse">NEW RIDE OFFER</span>
                                <span className="text-2xl font-black text-primary-green">£{pendingRequest.offeredPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center space-x-3 mb-6 bg-white/5 p-3 rounded-2xl">
                                <img src={pendingRequest.customer.photoUrl} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                                <div className="text-left flex-grow">
                                    <p className="text-sm font-bold">{pendingRequest.customer.name}</p>
                                    <Rating value={pendingRequest.customer.rating} />
                                </div>
                                <div className="flex flex-col items-end gap-1 opacity-80">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary-blue">
                                        <Users size={10} />
                                        <span>{pendingRequest.preferences.passengerCount} PAX</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase">
                                        <Navigation2 size={10} className="text-primary-blue" />
                                        <span>{pendingRequest.estimatedDistance}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8 text-left">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs font-medium text-gray-300 truncate">{pendingRequest.pickupLocation.address}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-primary-blue mt-0.5 flex-shrink-0" />
                                    <p className="text-xs font-medium text-gray-300 truncate">{pendingRequest.dropoffLocation.address}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                  onClick={() => handleDecline(pendingRequest)} 
                                  className="h-14 rounded-2xl bg-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/20"
                                >
                                  Decline
                                </button>
                                <button 
                                  onClick={() => handleAccept(pendingRequest)} 
                                  className="h-14 rounded-2xl bg-primary-blue text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-primary-blue/30"
                                >
                                  Accept
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Future Trips</h3>
              {reservations.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No scheduled reservations yet.</p>
              ) : (
                  reservations.map(rsv => (
                      <div key={rsv.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border dark:border-slate-800 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-primary-blue" />
                                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{rsv.preferences.scheduledTime}</p>
                              </div>
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg animate-pulse">
                                  <Bell size={10} />
                                  <span className="text-[8px] font-black uppercase">Starts Soon</span>
                              </div>
                          </div>
                          <div className="flex items-center gap-3 mb-4">
                              <img src={rsv.customer.photoUrl} className="w-10 h-10 rounded-full" />
                              <div className="flex-grow">
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">{rsv.customer.name}</p>
                                  <Rating value={rsv.customer.rating} />
                              </div>
                              <p className="text-lg font-black text-primary-green">£{rsv.offeredPrice.toFixed(0)}</p>
                          </div>
                          <button 
                            onClick={() => onStartReservation(rsv)}
                            className="w-full py-4 bg-primary-blue text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-blue/20"
                          >
                            Travel to your destination
                          </button>
                      </div>
                  ))
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;