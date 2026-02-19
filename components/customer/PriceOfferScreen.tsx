
import React, { useState, useEffect } from 'react';
import { RideRequest, SuggestedPrice } from '../../types';
import { getSuggestedPrice } from '../../services/geminiService';
import Header from '../shared/Header';
import Button from '../shared/Button';
import { MapPin, Loader2, Clock, Navigation2 } from 'lucide-react';

interface PriceOfferScreenProps {
  rideRequest: RideRequest;
  onCreateRideRequest: (price: number, distance: string, duration: string) => void;
  onBack: () => void;
}

const PriceOfferScreen: React.FC<PriceOfferScreenProps> = ({ rideRequest, onCreateRideRequest, onBack }) => {
  const [suggestedPrice, setSuggestedPrice] = useState<SuggestedPrice | null>(null);
  const [offerPrice, setOfferPrice] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      setIsLoading(true);
      const priceData = await getSuggestedPrice(
          rideRequest.pickupLocation.address, 
          rideRequest.dropoffLocation.address,
          rideRequest.preferences.vehicleClass,
          rideRequest.additionalStops?.length || 0
      );
      setSuggestedPrice(priceData);
      if (priceData) {
        setOfferPrice(priceData.average);
      }
      setIsLoading(false);
    };
    fetchPrice();
  }, [rideRequest]);

  const handleCreateRequest = () => {
    if (typeof offerPrice === 'number' && offerPrice > 0 && suggestedPrice) {
      onCreateRideRequest(offerPrice, suggestedPrice.distance || '', suggestedPrice.duration || '');
    }
  };

  const isActive = (val: number) => typeof offerPrice === 'number' && Math.abs(offerPrice - val) < 0.1;

  return (
    <div className="flex flex-col h-full bg-neutral-light-gray dark:bg-slate-950">
      <Header title="Your Offer" onBack={onBack} />
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-5 mb-4 border border-gray-100 dark:border-slate-800">
            <div className="flex items-start space-x-3">
                <div className="mt-1 w-2.5 h-2.5 rounded-full border-2 border-gray-300"></div>
                <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup</div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{rideRequest.pickupLocation.address}</p>
                </div>
            </div>
            <div className="h-4 ml-1 border-l-2 border-dashed border-gray-100 dark:border-slate-800 my-1"></div>
            <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary-blue mt-1"/>
                 <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destination</div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{rideRequest.dropoffLocation.address}</p>
                </div>
            </div>

            {suggestedPrice && !isLoading && (
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Navigation2 size={14} className="text-primary-blue" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{suggestedPrice.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary-blue" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{suggestedPrice.duration}</span>
                </div>
              </div>
            )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm p-6 text-center border border-gray-100 dark:border-slate-800 relative overflow-hidden">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.2em]">Select Your Fare</h3>
          
          {isLoading ? (
            <div className="h-24 flex flex-col items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary-blue mb-2" />
                <p className="text-xs text-slate-400 font-medium italic">Gemini is analyzing market rates...</p>
            </div>
          ) : suggestedPrice ? (
            <div className="grid grid-cols-3 gap-2 mb-8">
              <button 
                onClick={() => setOfferPrice(suggestedPrice.min)}
                className={`p-3 rounded-2xl transition-all ${isActive(suggestedPrice.min) ? 'bg-primary-blue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
              >
                <p className="text-lg font-black">£{suggestedPrice.min.toFixed(0)}</p>
                <p className="text-[9px] font-black uppercase tracking-tighter">Budget</p>
              </button>
              <button 
                onClick={() => setOfferPrice(suggestedPrice.average)}
                className={`p-3 rounded-2xl transition-all ${isActive(suggestedPrice.average) ? 'bg-primary-blue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
              >
                <p className="text-lg font-black">£{suggestedPrice.average.toFixed(0)}</p>
                <p className="text-[9px] font-black uppercase tracking-tighter">Suggested</p>
              </button>
              <button 
                onClick={() => setOfferPrice(suggestedPrice.max)}
                className={`p-3 rounded-2xl transition-all ${isActive(suggestedPrice.max) ? 'bg-primary-blue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
              >
                <p className="text-lg font-black">£{suggestedPrice.max.toFixed(0)}</p>
                <p className="text-[9px] font-black uppercase tracking-tighter">Priority</p>
              </button>
            </div>
          ) : null}

            <div className="relative w-52 mx-auto">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-primary-blue">£</span>
                <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full h-16 text-center text-4xl font-black bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-blue rounded-3xl outline-none text-slate-900 dark:text-white transition-all"
                />
            </div>
            <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class: {rideRequest.preferences.vehicleClass}</p>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <Button onClick={handleCreateRequest} disabled={isLoading || typeof offerPrice !== 'number' || offerPrice <= 0} className="rounded-3xl h-14 font-black uppercase tracking-widest shadow-xl shadow-primary-blue/20">
            Confirm Offer
        </Button>
      </div>
    </div>
  );
};

export default PriceOfferScreen;
