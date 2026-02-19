
import React, { useState } from 'react';
import { User, Driver, RideRequest, UserStatus } from '../../types';
import Header from '../shared/Header';
import TripsView from './TripsView';
import UsersView from './UsersView';
import AddDriverForm from './AddDriverForm';
import SystemLogsView from './SystemLogsView';
import AdminMapView from './AdminMapView';
import { List, Users, UserPlus, History, Map as MapIcon } from 'lucide-react';

interface AdminDashboardProps {
  users: (User | Driver)[];
  drivers: Driver[];
  rides: RideRequest[];
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
  onAddDriver: (formData: { name: string; vehicleMake: string; vehicleModel: string; licensePlate: string; }) => void;
}

type AdminTab = 'trips' | 'users' | 'map' | 'add_driver' | 'updates';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, drivers, rides, onUpdateUserStatus, onAddDriver }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('trips');

  const renderContent = () => {
    switch (activeTab) {
      case 'trips':
        return <TripsView rides={rides} />;
      case 'users':
        return <UsersView users={users} onUpdateUserStatus={onUpdateUserStatus} />;
      case 'map':
        return <AdminMapView drivers={drivers} />;
      case 'add_driver':
        return <AddDriverForm onAddDriver={onAddDriver} />;
      case 'updates':
        return <SystemLogsView />;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, icon: Icon, label }: { tab: AdminTab, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex flex-col items-center justify-center py-3 px-1 text-[8px] font-black uppercase tracking-tighter transition-all ${
        activeTab === tab 
        ? 'text-primary-blue bg-blue-50/50 dark:bg-primary-blue/10 dark:text-primary-blue' 
        : 'text-neutral-medium-gray dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800/50'
      }`}
    >
      <Icon size={16} className="mb-1" />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-neutral-light-gray dark:bg-slate-950">
      <Header title="Admin Panel" />
      <div className="flex-grow overflow-y-auto pb-20">
        {renderContent()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex border-t dark:border-slate-800 bg-white dark:bg-slate-900 z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <TabButton tab="trips" icon={List} label="Trips" />
        <TabButton tab="users" icon={Users} label="Users" />
        <TabButton tab="map" icon={MapIcon} label="Live Map" />
        <TabButton tab="add_driver" icon={UserPlus} label="Add" />
        <TabButton tab="updates" icon={History} label="Logs" />
      </div>
    </div>
  );
};

export default AdminDashboard;
