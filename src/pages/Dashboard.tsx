
import React from 'react';
import { Icons } from '../constants';
import { useData } from '../contexts/DataContext';
import { TumorClass } from '../types';

interface DashboardProps {
  userName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userName = 'Doctor' }) => {
  const { reports, patients } = useData();

  // Calculate dynamic stats
  const totalAnalyses = reports.length;
  const recentReports = reports.filter(r => {
    const today = new Date().toISOString().split('T')[0];
    return r.date === today;
  }).length;

  const malignantCount = reports.filter(r => r.tumorClass === TumorClass.MALIGNANT).length;

  const stats = [
    { label: 'Total Analyses', value: totalAnalyses.toString(), change: totalAnalyses > 0 ? 'Active' : 'No data', icon: Icons.Analysis },
    { label: 'Today\'s Reports', value: recentReports.toString(), change: recentReports > 0 ? 'New' : 'Waiting', icon: Icons.Reports },
    { label: 'Malignant Cases', value: malignantCount.toString(), change: `${((malignantCount / (totalAnalyses || 1)) * 100).toFixed(0)}%`, icon: Icons.Microscope },
    { label: 'Registered Patients', value: patients.length.toString(), change: 'Total', icon: Icons.Profile },
  ];

  return (
    <div className="fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {userName}</h1>
        <p className="text-slate-500">Here is what's happening in your department today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <stat.icon />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Diagnosis Distribution - Full Width */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Diagnosis Distribution</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">Benign</span>
            <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-full">Malignant</span>
          </div>
        </div>

        <div className="h-64 flex items-end justify-around p-4 border-b border-l border-slate-200">
          {totalAnalyses > 0 ? (
            <>
              <div className="w-32 flex flex-col items-center gap-2 group">
                <div
                  className="w-full bg-green-500 rounded-t-lg transition-all duration-500 relative hover:bg-green-600 shadow-lg"
                  style={{
                    height: `${Math.max(((totalAnalyses - malignantCount) / totalAnalyses) * 100, 10)}%`,
                    minHeight: '40px'
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm py-1.5 px-3 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {totalAnalyses - malignantCount} cases
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-lg">
                    {totalAnalyses - malignantCount}
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-600">Benign</p>
                <p className="text-xs text-slate-400">{totalAnalyses > 0 ? Math.round(((totalAnalyses - malignantCount) / totalAnalyses) * 100) : 0}%</p>
              </div>
              <div className="w-32 flex flex-col items-center gap-2 group">
                <div
                  className="w-full bg-red-500 rounded-t-lg transition-all duration-500 relative hover:bg-red-600 shadow-lg"
                  style={{
                    height: `${Math.max((malignantCount / totalAnalyses) * 100, 10)}%`,
                    minHeight: '40px'
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm py-1.5 px-3 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {malignantCount} cases
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-lg">
                    {malignantCount}
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-600">Malignant</p>
                <p className="text-xs text-slate-400">{totalAnalyses > 0 ? Math.round((malignantCount / totalAnalyses) * 100) : 0}%</p>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <Icons.Analysis size={48} className="opacity-20 mb-4" />
              <p className="text-sm font-medium">No predictions yet</p>
              <p className="text-xs mt-1">Perform an analysis to see statistics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
