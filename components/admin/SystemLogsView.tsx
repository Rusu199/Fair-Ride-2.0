import React from 'react';
import { CheckCircle2, TrendingUp, Scale, Layout, ShieldCheck } from 'lucide-react';

const SystemLogsView: React.FC = () => {
  const updates = [
    {
      id: 1,
      title: 'Legal Compliance: Payment Timing',
      description: 'Modified app flow to require direct payment at the start of the trip per PHD regulations.',
      icon: Scale,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      date: 'Tonight'
    },
    {
      id: 2,
      title: 'Pricing Engine: 30% Driver Incentive',
      description: 'Updated Gemini pricing model to include a 30% markup on standard market rates for better driver retention.',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      date: 'Tonight'
    },
    {
      id: 3,
      title: 'UI Clarity: Address Suggestions',
      description: 'Fixed visibility issues in autocomplete dropdown. Implemented high-contrast styling for outdoor usage.',
      icon: Layout,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      date: 'Tonight'
    },
    {
      id: 4,
      title: 'Security: Safety Hub Active',
      description: 'Integrated emergency alerts and live trip sharing capabilities for passenger security.',
      icon: ShieldCheck,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      date: 'Previous'
    }
  ];

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Project Milestones</h2>
        <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-full">v1.2.0-TEST</span>
      </div>
      
      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 ${update.bg} -mr-8 -mt-8 rounded-full opacity-50`}></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className={`p-3 rounded-xl ${update.bg} ${update.color}`}>
                <update.icon size={20} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight pr-4">{update.title}</h3>
                  <span className="text-[9px] font-black text-slate-400 uppercase whitespace-nowrap">{update.date}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {update.description}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-green-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified & Implemented</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-6 bg-slate-900 rounded-[32px] text-center text-white">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Build Ready</p>
        <p className="text-sm font-bold text-slate-200">Session saved. The application is prepared for Android APK generation.</p>
      </div>
    </div>
  );
};

export default SystemLogsView;