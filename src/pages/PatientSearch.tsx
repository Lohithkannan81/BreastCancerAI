import React, { useState } from 'react';
import { Icons } from '../constants';
import { useData } from '../contexts/DataContext';
import { TumorClass } from '../types';

const PatientSearch: React.FC = () => {
    const { patients, getPatientReports } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

    // Filter patients based on search, show all if empty
    const filteredPatients = patients.filter(p =>
        searchTerm === '' ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectPatient = (patient: any) => {
        setSelectedPatient(patient);
    };

    const currentReports = selectedPatient ? getPatientReports(selectedPatient.id) : [];

    return (
        <div className="fade-in space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Patient Search</h1>
                <p className="text-slate-500">Find patient records and analysis history.</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Icons.Profile className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSelectedPatient(null); // Clear selection on search change
                            }}
                            placeholder="Search by Patient ID (e.g. PT-1024) or Name"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Results or Selection */}
            {selectedPatient ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                    <button onClick={() => setSelectedPatient(null)} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Icons.X size={14} /> Back to List
                    </button>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
                            <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Icons.Profile size={14} /> {selectedPatient.id}</span>
                                <span className="flex items-center gap-1">Age: {selectedPatient.age}</span>
                                <span className="flex items-center gap-1">Contact: {selectedPatient.contact || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 md:w-1/3">
                            <span className="block font-bold text-slate-400 text-xs uppercase tracking-wider mb-1">Medical History</span>
                            <p className="text-sm text-slate-700">{selectedPatient.history || 'No records.'}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">Analysis History</h3>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Result</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Confidence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentReports.length > 0 ? (
                                    currentReports.map(report => (
                                        <tr key={report.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-slate-600">{report.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${report.tumorClass === TumorClass.MALIGNANT ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`}>
                                                    {report.tumorClass}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{report.confidence}%</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-400">No analysis reports found for this patient.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map(patient => (
                            <div key={patient.id} onClick={() => handleSelectPatient(patient)} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Icons.Profile size={20} />
                                    </div>
                                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{patient.id}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{patient.name}</h3>
                                <p className="text-sm text-slate-500">Age: {patient.age} • {patient.contact || 'No Contact'}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-slate-400">
                            <p>No patients found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatientSearch;
