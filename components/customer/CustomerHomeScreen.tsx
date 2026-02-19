
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ArrowRight, VolumeX, Snowflake, Briefcase as LuggageIcon, Crosshair, Search, Loader2, Plus, Minus, Users, Car, Calendar, X, Beaker } from 'lucide-react';
import Button from '../shared/Button';
import Map, { MarkerInfo } from '../shared/Map';
import { MOCK_PICKUP, MOCK_DROPOFF, MOCK_DRIVERS } from '../../constants';
import { RidePreferences, VehicleClass } from '../../types';
import { getAddressSuggestions, getReverseGeocode } from '../../services/geminiService';

interface CustomerHomeScreenProps {
  onConfirmTrip: (pickup: string, destination: string, preferences: RidePreferences) => void;
}

const CustomerHomeScreen: React.FC<CustomerHomeScreenProps> = ({ onConfirmTrip }) => {
  const [pickup, setPickup] = useState(MOCK_PICKUP.address);
  const [stops, setStops] = useState<string[]>([]);
  const [destination, setDestination] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<{ type: 'pickup' | 'destination' | 'stop', index?: number } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const searchTimeout = useRef<any>(null);

  const [prefs, setPrefs] = useState<RidePreferences>({
    quietRide: false,
    acOn: true,
    luggage: false,
    passengerCount: 1,
    vehicleClass: 'standard',
    scheduledTime: undefined
  });

  const handleConfirm = () => {
    if (pickup.trim() && destination.trim()) {
      onConfirmTrip(pickup, destination, prefs);
    }
  };

  const handleTestFill = () => {
    setPickup(MOCK_PICKUP.address);
    setDestination(MOCK_DROPOFF.address);
  };

  const handleLiveLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const address = await getReverseGeocode(position.coords.latitude, position.coords.longitude);
          setPickup(address);
          setIsLocating(false);
        },
        (error) => {
          console.error("Location error:", error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const onInputChange = (val: string, type: 'pickup' | 'destination' | 'stop', index?: number) => {
    if (type === 'pickup') setPickup(val);
    else if (type === 'destination') setDestination(val);
    else if (type === 'stop' && typeof index === 'number') {
        const newStops = [...stops];
        newStops[index] = val;
        setStops(newStops);
    }
    
    setActiveField({ type, index });

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (val.length >= 3) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(async () => {
        const results = await getAddressSuggestions(val);
        setSuggestions(results);
        setIsSearching(false);
      }, 500);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const selectSuggestion = (s: string) => {
    if (!activeField) return;
    if (activeField.type === 'pickup') setPickup(s);
    else if (activeField.type === 'destination') setDestination(s);
    else if (activeField.type === 'stop' && typeof activeField.index === 'number') {
        const newStops = [...stops];
        newStops[activeField.index] = s;
        setStops(newStops);
    }
    setSuggestions([]);
    setActiveField(null);
  };

  const addStop = () => {
      if (stops.length < 3) {
          setStops([...stops, '']);
      }
  };

  const removeStop = (index: number) => {
      setStops(stops.filter((_, i) => i !== index));
  };

  const updatePassCount = (delta: number) => {
    const next = Math.max(1, Math.min(7, prefs.passengerCount + delta));
    let nextClass = prefs.vehicleClass;
    if (next > 4) nextClass = 'xl';
    setPrefs({ ...prefs, passengerCount: next, vehicleClass: nextClass });
  };

  const markers: MarkerInfo[] = [
    { position: MOCK_PICKUP.coordinates, type: 'pickup', popupContent: 'Pickup' },
    ...MOCK_DRIVERS.map(d => ({ position: d.location, type: 'driver' as const, popupContent: d.name }))
  ];

  const PreferenceToggle = ({ icon: Icon, active, label, onClick }: any) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${active ? 'bg-primary-blue text-white border-primary-blue' : 'bg-white dark:bg-slate-800 text-neutral-medium-gray dark:text-slate-400 border-gray-200 dark:border-slate-700'}`}
    >
      <Icon size={18} />
      <span className="text-[10px] mt-1 font-bold">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <div className="absolute inset-0 z-0">
         <Map center={MOCK_PICKUP.coordinates} zoom={13} markers={markers} />
      </div>

      <div className="relative z-20 p-4 mt-auto">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-5 border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Your Trip</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={handleTestFill}
                    className="p-2 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors flex items-center gap-2"
                    title="Quick Test Route"
                  >
                    <Beaker size={18} />
                    <span className="text-[10px] font-black uppercase">Test Route</span>
                  </button>
                  <button 
                      onClick={() => setIsScheduling(!isScheduling)}
                      className={`p-2 rounded-xl transition-colors ${prefs.scheduledTime ? 'bg-primary-blue text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                  >
                      <Calendar size={18} />
                  </button>
                </div>
            </div>
            
            <div className="space-y-3 mb-6 relative">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-gray-500"></div>
                <input
                  type="text" value={pickup} onFocus={() => setActiveField({ type: 'pickup' })} onChange={(e) => onInputChange(e.target.value, 'pickup')}
                  placeholder="Pickup point"
                  className="w-full h-11 pl-12 pr-12 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary-blue outline-none text-sm font-bold text-slate-900 dark:text-white"
                />
                <button onClick={handleLiveLocation} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${isLocating ? 'text-primary-blue animate-pulse' : 'text-slate-400 dark:text-slate-500'}`}>
                  <Crosshair size={18} />
                </button>
              </div>

              {stops.map((stopVal, idx) => (
                <div key={idx} className="relative animate-in slide-in-from-left duration-200">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-primary-orange"></div>
                    <input
                      type="text" value={stopVal} onFocus={() => setActiveField({ type: 'stop', index: idx })} onChange={(e) => onInputChange(e.target.value, 'stop', idx)}
                      placeholder="Additional stop"
                      className="w-full h-11 pl-12 pr-12 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary-blue outline-none text-sm font-bold text-slate-900 dark:text-white"
                    />
                    <button onClick={() => removeStop(idx)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-status-error"><X size={16}/></button>
                </div>
              ))}

              {stops.length < 3 && (
                <button onClick={addStop} className="flex items-center gap-2 px-4 py-1 text-[10px] font-black text-primary-blue uppercase tracking-widest hover:opacity-70 transition-opacity">
                    <Plus size={14}/> Add Stop
                </button>
              )}
              
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-blue" size={20} />
                <input
                  type="text" value={destination} onFocus={() => setActiveField({ type: 'destination' })} onChange={(e) => onInputChange(e.target.value, 'destination')}
                  placeholder="Final Destination"
                  className="w-full h-11 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary-blue outline-none text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              {isScheduling && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                      <p className="text-[10px] font-black text-primary-blue uppercase mb-2">Schedule Ride</p>
                      <input 
                        type="datetime-local" 
                        onChange={(e) => setPrefs({...prefs, scheduledTime: e.target.value})}
                        className="w-full bg-white dark:bg-slate-800 rounded-xl p-2 text-xs font-bold dark:text-white outline-none"
                      />
                  </div>
              )}

              {(suggestions.length > 0 || isSearching) && activeField && (
                <div className="absolute left-0 right-0 bottom-full mb-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-[9999]">
                  {isSearching && (
                    <div className="p-4 flex items-center justify-center space-x-2 text-xs text-slate-500">
                      <Loader2 size={14} className="animate-spin text-primary-blue" />
                      <span className="font-bold">Searching...</span>
                    </div>
                  )}
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx} onClick={() => selectSuggestion(s)}
                      className="w-full p-4 text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 last:border-0 flex items-center"
                    >
                      <MapPin size={16} className="text-primary-blue mr-3 shrink-0" />
                      <span className="truncate">{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">Class</p>
                    <select 
                        value={prefs.vehicleClass} 
                        onChange={(e) => setPrefs({...prefs, vehicleClass: e.target.value as VehicleClass})}
                        className="w-full h-10 px-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none border-none ring-0"
                    >
                        <option value="standard">Standard</option>
                        <option value="xl">XL (7 Seats)</option>
                        <option value="premium">Premium</option>
                        <option value="premium_xl">Premium XL</option>
                    </select>
                </div>
                <div className="w-28 text-center">
                    <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">People</p>
                    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 h-10 rounded-xl px-2">
                        <button onClick={() => updatePassCount(-1)} className="p-1 text-primary-blue"><Minus size={14}/></button>
                        <span className="text-xs font-black text-slate-900 dark:text-white">{prefs.passengerCount}</span>
                        <button onClick={() => updatePassCount(1)} className="p-1 text-primary-blue"><Plus size={14}/></button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                <PreferenceToggle icon={VolumeX} label="QUIET" active={prefs.quietRide} onClick={() => setPrefs({...prefs, quietRide: !prefs.quietRide})} />
                <PreferenceToggle icon={Snowflake} label="AC ON" active={prefs.acOn} onClick={() => setPrefs({...prefs, acOn: !prefs.acOn})} />
                <PreferenceToggle icon={LuggageIcon} label="LUGGAGE" active={prefs.luggage} onClick={() => setPrefs({...prefs, luggage: !prefs.luggage})} />
            </div>

            <Button onClick={handleConfirm} disabled={!pickup.trim() || !destination.trim()} className="rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-primary-blue/20">
              {prefs.scheduledTime ? 'Schedule Ride' : 'Continue to Offers'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerHomeScreen;
