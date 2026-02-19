import React, { useState } from 'react';
import Button from '../shared/Button';

interface AddDriverFormProps {
  onAddDriver: (formData: { name: string; vehicleMake: string; vehicleModel: string; licensePlate: string; }) => void;
}

const AddDriverForm: React.FC<AddDriverFormProps> = ({ onAddDriver }) => {
  const [name, setName] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && vehicleMake && vehicleModel && licensePlate) {
      onAddDriver({ name, vehicleMake, vehicleModel, licensePlate });
      setName('');
      setVehicleMake('');
      setVehicleModel('');
      setLicensePlate('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-neutral-dark-gray dark:text-white mb-4">Add New Driver</h2>
      {submitted && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-2xl relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> New driver has been added to the registry.</span>
          </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm">
        <div>
          <label htmlFor="name" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary-blue outline-none text-sm font-bold"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicleMake" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Make</label>
              <input
                type="text"
                id="vehicleMake"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                required
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary-blue outline-none text-sm font-bold"
              />
            </div>
            <div>
              <label htmlFor="vehicleModel" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Model</label>
              <input
                type="text"
                id="vehicleModel"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                required
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary-blue outline-none text-sm font-bold"
              />
            </div>
        </div>
        <div>
          <label htmlFor="licensePlate" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">License Plate</label>
          <input
            type="text"
            id="licensePlate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            required
            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary-blue outline-none text-sm font-bold"
          />
        </div>
        <div className="pt-4">
            <Button type="submit" className="rounded-2xl h-14 font-black uppercase tracking-widest shadow-lg shadow-primary-blue/20">
                Register Driver
            </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDriverForm;