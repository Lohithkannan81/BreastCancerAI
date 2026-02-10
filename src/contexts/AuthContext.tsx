import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string, name: string, role: string, organization: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                setCurrentUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to load user', e);
            }
        }
    }, []);

    // Save login history
    const saveLoginHistory = (email: string) => {
        const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
        const newEntry = {
            email,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleString()
        };
        loginHistory.push(newEntry);
        localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
    };

    const login = (email: string, _password: string, name: string, role: string, organization: string) => {
        const user: User = {
            id: email, // Using email as unique ID
            email,
            name,
            role: role as any,
            organization
        };

        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        saveLoginHistory(email);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const value = {
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
