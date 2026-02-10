import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Report, AnalysisStatus } from '../types';

interface DataContextType {
    patients: Patient[];
    reports: Report[];
    addPatient: (patient: Omit<Patient, 'registeredDate'>) => void;
    addReport: (report: Omit<Report, 'id' | 'date' | 'status'>) => void;
    getPatientReports: (patientId: string) => Report[];
    getPatient: (patientId: string) => Patient | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider: React.FC<{ children: ReactNode; userId?: string }> = ({ children, userId }) => {
    // Initialize state
    const [patients, setPatients] = useState<Patient[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load data when userId changes
    useEffect(() => {
        console.log('🔄 DataContext: userId changed to:', userId);
        setIsInitialized(false); // Reset on user change

        if (!userId) {
            console.log('🚪 DataContext: User logged out, clearing state');
            // Clear state when user logs out
            setPatients([]);
            setReports([]);
            return;
        }

        const loadData = () => {
            try {
                const patientsKey = `patients_${userId}`;
                const reportsKey = `reports_${userId}`;
                console.log('📂 Loading from:', patientsKey, reportsKey);

                const savedPatients = localStorage.getItem(patientsKey);
                const savedReports = localStorage.getItem(reportsKey);

                const loadedPatients = savedPatients ? JSON.parse(savedPatients) : [];
                const loadedReports = savedReports ? JSON.parse(savedReports) : [];
                console.log('✅ Loaded:', loadedPatients.length, 'patients,', loadedReports.length, 'reports');

                // Load data for the current user
                setPatients(loadedPatients);
                setReports(loadedReports);

                // Mark as initialized after loading
                setIsInitialized(true);
            } catch (e) {
                console.error("Failed to load user data", e);
                setPatients([]);
                setReports([]);
                setIsInitialized(true);
            }
        };

        loadData();
    }, [userId]);

    // Save to localStorage whenever state changes (only after initialization)
    useEffect(() => {
        if (!userId || !isInitialized) return;

        try {
            const key = `patients_${userId}`;
            console.log('💾 Saving patients to:', key, patients.length, 'items');
            localStorage.setItem(key, JSON.stringify(patients));
        } catch (e) {
            console.error("Failed to save patients", e);
        }
    }, [patients, userId, isInitialized]);

    useEffect(() => {
        if (!userId || !isInitialized) return;

        try {
            const key = `reports_${userId}`;
            console.log('💾 Saving reports to:', key, reports.length, 'items');
            localStorage.setItem(key, JSON.stringify(reports));
        } catch (e) {
            console.error("Failed to save reports - Storage Full", e);
            // Fallback: Try saving without the Base64 images
            try {
                const lightweightReports = reports.map(r => {
                    const { imageUrl, ...rest } = r;
                    return rest;
                });
                localStorage.setItem(`reports_${userId}`, JSON.stringify(lightweightReports));
                console.warn("Saved reports without images due to storage limits.");
            } catch (retryError) {
                console.error("Critical: Could not save reports even without images.", retryError);
            }
        }
    }, [reports, userId, isInitialized]);

    const addPatient = (patientData: Omit<Patient, 'registeredDate'>) => {
        const newPatient: Patient = {
            ...patientData,
            registeredDate: new Date().toISOString().split('T')[0]
        };
        setPatients(prev => [...prev, newPatient]);
    };

    const addReport = (reportData: Omit<Report, 'id' | 'date' | 'status'>) => {
        const newReport: Report = {
            ...reportData,
            id: `AN-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString().split('T')[0],
            status: AnalysisStatus.COMPLETED
        };
        setReports(prev => [newReport, ...prev]);
    };

    const getPatientReports = (patientId: string) => {
        return reports.filter(r => r.patientId === patientId);
    };

    const getPatient = (patientId: string) => {
        return patients.find(p => p.id === patientId);
    };

    return (
        <DataContext.Provider value={{ patients, reports, addPatient, addReport, getPatientReports, getPatient }}>
            {children}
        </DataContext.Provider>
    );
};
