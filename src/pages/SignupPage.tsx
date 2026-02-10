import React, { useState } from 'react';
import { UserRole } from '../types';

interface SignupPageProps {
  onSignup: (
    name: string,
    email: string,
    password: string,
    role: string,
    organization: string,
    department: string
  ) => Promise<{ success: boolean; error?: string }>;
  onLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onLogin }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    role: UserRole.DOCTOR as string,
    organization: '',
    department: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      nextStep();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await onSignup(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.organization,
        formData.department
      );
      if (result.success) {
        alert('Registration successful! Please login with your new credentials.');
        onLogin();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen medical-gradient flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden fade-in">
        <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Credential Registration</h2>
            <p className="text-slate-400 text-sm mt-1">Step {step} of 3 — {step === 1 ? 'Personal Profile' : step === 2 ? 'Clinical Identity' : 'Security'}</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="fade-in space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Legal Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Sarah Richardson"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@med.edu"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Professional Role</label>
                <div className="grid grid-cols-2 gap-4">
                  {[UserRole.DOCTOR, UserRole.RESEARCHER, UserRole.STUDENT, UserRole.ADMIN].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role as string })}
                      className={`px-6 py-4 rounded-2xl text-sm font-bold border transition-all ${formData.role === role ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-300'
                        }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Organization</label>
                  <input
                    required
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Mayo Clinic / Johns Hopkins"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Department</label>
                  <input
                    required
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Oncology / Pathology"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Choose Secure Password</label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Must include 6+ characters.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
                <input
                  required
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between gap-4 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-8 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
              >
                Previous
              </button>
            ) : (
              <button
                type="button"
                onClick={onLogin}
                className="flex-1 px-8 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
              >
                Back to Login
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                step < 3 ? 'Continue' : 'Complete Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
