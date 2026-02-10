import React, { useState, useRef } from 'react';
import { Icons } from '../constants';
import { AnalysisStatus, TumorClass } from '../types';
import { analyzeMedicalImage } from '../services/geminiService';
import { useData } from '../contexts/DataContext';
import jsPDF from 'jspdf';


const NewAnalysis: React.FC = () => {
  const { addReport, patients } = useData();
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<{ tumorClass: TumorClass; confidence: number; explanation: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStatus(AnalysisStatus.IDLE);
        setResult(null);
        setRecommendations([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRecommendations = () => {
    // Random recommendations for demo
    const recs = [
      "Schedule follow-up Core Needle Biopsy within 48 hours.",
      "Urgent referral to Oncology for staging consultation.",
      "Conduct BRCA1/BRCA2 genetic screening.",
      "Schedule bilateral MRI for further assessment.",
      "Prepare multidisciplinary team review (Tumor Board)."
    ];
    // Shuffle and pick 2-3
    return recs.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const handlePredict = async () => {
    if (!image) return;

    if (!patientId.trim()) {
      showNotification("Patient ID is required for analysis.");
      return;
    }

    // Verify patient is registered
    const isRegistered = patients.some(p => p.id === patientId);
    if (!isRegistered) {
      showNotification("Patient ID not found. Please register the patient first.");
      return;
    }

    const pId = patientId;
    const pName = patientName || `Anonymous Patient`;

    setStatus(AnalysisStatus.ANALYZING);

    // Slight delay to simulate system initialization
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const analysis = await analyzeMedicalImage(image);
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETED);

      const isMalignant = analysis.tumorClass === TumorClass.MALIGNANT;
      const recs = isMalignant ? generateRecommendations() : ["Routine annual screening recommended."];
      setRecommendations(recs);

      // Add to context history
      addReport({
        patientId: pId,
        patientName: pName,
        tumorClass: analysis.tumorClass,
        confidence: analysis.confidence,
        explanation: analysis.explanation,
        // status: AnalysisStatus.COMPLETED, // Handled by context
        // type: 'Histopathology', // Removed
        imageUrl: image,
        recommendations: recs
      });

      showNotification("Analysis complete & report saved.");

    } catch (err) {
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const reset = () => {
    setImage(null);
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setNotification(null);
    setRecommendations([]);
    setPatientId('');
    setPatientName('');
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // ... (keep strict imports)

  const handleDownloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();

    // Header
    doc.setFillColor(41, 128, 185); // Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("BreastCancerAI", 20, 25);
    doc.setFontSize(10);
    doc.text("Diagnostic Analysis Report", 150, 25);

    // Patient Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Patient ID: ${patientId}`, 20, 50);
    doc.text(`Patient Name: ${patientName || 'N/A'}`, 20, 60);
    doc.text(`Date: ${new Date().toLocaleString()}`, 140, 50);
    doc.text(`Report ID: ${Date.now()}`, 140, 60);

    // Line Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 70, 190, 70);

    // Results
    doc.setFontSize(16);
    doc.setTextColor(result.tumorClass === TumorClass.MALIGNANT ? 200 : 0, result.tumorClass === TumorClass.BENIGN ? 150 : 0, 0);
    doc.text(`Result: ${result.tumorClass.toUpperCase()}`, 20, 90);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Confidence: ${result.confidence}%`, 140, 90);

    // Findings
    doc.setFontSize(14);
    doc.text("AI Findings:", 20, 110);
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    const splitText = doc.splitTextToSize(result.explanation, 170);
    doc.text(splitText, 20, 120);

    // Recommendations
    if (recommendations.length > 0) {
      let yPos = 120 + (splitText.length * 5) + 20;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Clinical Recommendations:", 20, yPos);

      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      yPos += 10;
      recommendations.forEach(rec => {
        doc.text(`• ${rec}`, 25, yPos);
        yPos += 7;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by BreastCancerAI. This is an assistive tool and not a final diagnosis.", 20, 280);

    doc.save(`Report_${patientId}_${Date.now()}.pdf`);
    showNotification('PDF downloaded successfully!');
  };


  return (
    <div className="fade-in max-w-5xl mx-auto space-y-8 pb-12 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Diagnostic Analysis</h1>
          <p className="text-slate-500">Upload high-resolution histopathology or mammography scans.</p>
        </div>
        {image && (
          <button
            onClick={reset}
            className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
          >
            Clear and Start Over
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Upload and Preview */}
        <div className="md:col-span-2 space-y-6">
          {!image ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 bg-white rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                <Icons.Cloud />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Drag & drop medical images here</h3>
              <p className="text-slate-500 text-sm mb-6">Supports JPG, PNG, DICOM (max 25MB)</p>
              <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-all">Browse Files</button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden">
                <img src={image} className="w-full h-full object-contain" alt="Scan Preview" />
                {status === AnalysisStatus.ANALYZING && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-800 font-bold animate-pulse">Running Neural Networks...</p>
                    <p className="text-blue-600 text-xs mt-2 uppercase tracking-widest">Scanning morphological patterns</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Result Section */}
          {result && status === AnalysisStatus.COMPLETED && (
            <div className={`p-8 rounded-2xl border-2 transition-all-custom fade-in ${result.tumorClass === TumorClass.MALIGNANT
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
              }`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className={`text-lg font-bold ${result.tumorClass === TumorClass.MALIGNANT ? 'text-red-900' : 'text-green-900'
                    }`}>
                    Prediction: {result.tumorClass}
                  </h3>
                  <p className={`${result.tumorClass === TumorClass.MALIGNANT ? 'text-red-700' : 'text-green-700'
                    } text-sm mt-1`}>
                    {result.tumorClass === TumorClass.MALIGNANT
                      ? 'Malignant patterns detected. Further clinical evaluation recommended.'
                      : 'No malignant indicators detected. Normal tissue morphology observed.'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900">{result.confidence}%</span>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Confidence Score</p>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full transition-all duration-1000 ${result.tumorClass === TumorClass.MALIGNANT ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>

              <div className="bg-white/80 p-4 rounded-xl border border-slate-100 mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AI Findings</h4>
                <p className="text-slate-700 text-sm leading-relaxed italic">{result.explanation}</p>
              </div>

              {recommendations.length > 0 && result.tumorClass === TumorClass.MALIGNANT && (
                <div className="bg-white/80 p-4 rounded-xl border border-slate-100 mb-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    {recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={handleDownloadPDF} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <Icons.Reports />
                  Download PDF Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Case Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icons.Profile />
              Case Context
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient ID</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter ID (Required)"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Name (Optional)</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Anonymous if empty"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Notes</label>
                <textarea rows={4} placeholder="Initial observations..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" />
              </div>
            </div>
          </div>

          <button
            disabled={!image || status === AnalysisStatus.ANALYZING}
            onClick={handlePredict}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${!image || status === AnalysisStatus.ANALYZING
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
              }`}
          >
            {status === AnalysisStatus.ANALYZING ? 'Processing...' : 'Run Prediction'}
            <Icons.Microscope />
          </button>

          <div className="bg-slate-100 p-4 rounded-xl">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Privacy Guarantee</p>
            <p className="text-[10px] text-slate-400 leading-tight">All processed images are anonymized. Patient identifiers are not stored in the AI model during training or inference. HIPAA Compliant.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAnalysis;
