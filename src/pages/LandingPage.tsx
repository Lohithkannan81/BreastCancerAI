import React from 'react';
import { Icons } from '../constants';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">O</div>
          <span className="text-2xl font-bold text-slate-800">OncoVision AI</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onLogin} className="text-slate-600 font-medium hover:text-blue-600 px-4 py-2">Login</button>
          <button onClick={onStart} className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
            AI Based Breast Cancer Detection using <br />
            <span className="text-blue-600">Mammogram Image Analysis</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
            Upload medical images and receive fast, reliable risk assessment powered by state-of-the-art neural networks designed for clinical histopathology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onStart} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
              Start New Analysis
              <Icons.Analysis />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              View Research
              <Icons.Reports />
            </button>
          </div>
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://picsum.photos/100/100?random=${i}`} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
              ))}
            </div>
            <p className="text-sm text-slate-500 font-medium">Trusted Clinical Research Using BreastCancerAI</p>
          </div>
        </div>
        <div className="relative fade-in">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>
          <img
            src="https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="rounded-3xl shadow-2xl relative z-10 border-4 border-white object-cover h-[500px] w-full"
            alt="Mammogram Analysis AI"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Advanced Clinical Intelligence</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Our platform combines high-resolution imaging support with deep learning to assist specialists in rapid diagnostics.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Fast Prediction', desc: 'Results in under 30 seconds after upload.', icon: Icons.Dashboard },
              { title: 'Clinical Accuracy', desc: 'Validated against multi-center datasets.', icon: Icons.Microscope },
              { title: 'Secure Data', desc: 'End-to-end encryption & HIPAA compliant.', icon: Icons.Shield },
              { title: 'Research Support', desc: 'Export detailed reports for publications.', icon: Icons.Reports }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <div className="bg-blue-900 text-blue-100 py-4 px-4 text-center text-sm font-medium">
        Disclaimer: OncoVision AI supports, but does not replace, clinical diagnosis by qualified medical professionals.
      </div>
    </div>
  );
};

export default LandingPage;
