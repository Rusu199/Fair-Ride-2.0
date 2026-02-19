import React from 'react';
import { User, Driver, UserStatus } from '../../types';
import Rating from '../shared/Rating';

interface UsersViewProps {
  users: (User | Driver)[];
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
}

const UsersView: React.FC<UsersViewProps> = ({ users, onUpdateUserStatus }) => {

  const isDriver = (user: User | Driver): user is Driver => {
    return 'vehicle' in user;
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'banned': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-bold text-neutral-dark-gray dark:text-white mb-2">Manage Users ({users.length})</h2>
      {users.map(user => (
        <div key={user.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <img src={user.photoUrl} alt={user.name} className="w-14 h-14 rounded-2xl border border-gray-100 dark:border-slate-800 object-cover" />
            <div className="flex-grow">
              <p className="font-black text-neutral-dark-gray dark:text-white">{user.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Rating value={user.rating} />
                <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                 <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full ${isDriver(user) ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {isDriver(user) ? 'Driver' : 'Customer'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t dark:border-slate-800 flex justify-end items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Status:</span>
            <select
              value={user.status}
              onChange={(e) => onUpdateUserStatus(user.id, e.target.value as UserStatus)}
              className="text-xs font-bold bg-slate-50 dark:bg-slate-800 dark:text-white border-transparent focus:ring-primary-blue rounded-xl p-2 outline-none"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersView;