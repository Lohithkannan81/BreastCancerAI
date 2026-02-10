import React, { useState } from 'react';
import { Icons } from '../constants';
import { useData } from '../contexts/DataContext';

const PatientRegistration: React.FC = () => {
    const { addPatient } = useData();
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        age: '',
        contact: '',
        history: ''
    });
    const [notification, setNotification] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.id) {
            showNotification("Please fill in required fields.");
            return;
        }

        addPatient({
            id: formData.id,
            name: formData.name,
            age: parseInt(formData.age) || 0,
            contact: formData.contact,
            history: formData.history
        });

        showNotification("Patient registered successfully!");
        setFormData({ name: '', id: '', age: '', contact: '', history: '' });
    };

    return (
        <div className="fade-in max-w-2xl mx-auto space-y-8">
            {notification && (
                <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-pulse">
                    {notification}
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Patient Registration</h1>
                <p className="text-slate-500">Register new patients to the OncoVision system.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient ID *</label>
                        <div className="relative">
                            <Icons.Profile className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="e.g. PT-1024"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Jane Doe"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="45"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact No.</label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="+1 555-0000"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Medical History / Notes</label>
                        <textarea
                            name="history"
                            value={formData.history}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Previous conditions, allergies, hereditary factors..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
                        <Icons.Profile className="w-5 h-5" />
                        Register Patient
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientRegistration;
