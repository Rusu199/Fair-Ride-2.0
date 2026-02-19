
import React from 'react';
import { Driver } from '../../types';
import Map, { MarkerInfo } from '../shared/Map';
import { MOCK_PICKUP } from '../../constants';

interface AdminMapViewProps {
  drivers: Driver[];
}

const AdminMapView: React.FC<AdminMapViewProps> = ({ drivers }) => {
  const markers: MarkerInfo[] = drivers.map(d => ({
    position: d.location,
    type: 'driver' as const,
    popupContent: `${d.name} (${d.vehicle.make} ${d.vehicle.model})`
  }));

  return (
    <div className="h-full w-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Fleet</h2>
        <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-primary-green text-[10px] font-black rounded-full animate-pulse uppercase tracking-widest">{drivers.length} DRIVERS ONLINE</span>
      </div>
      <div className="flex-grow rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative min-h-[400px]">
        <Map center={MOCK_PICKUP.coordinates} zoom={13} markers={markers} />
      </div>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Overview</p>
          <div className="flex gap-4">
              <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Central Hub</p>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">All drivers within 5km coverage.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AdminMapView;
