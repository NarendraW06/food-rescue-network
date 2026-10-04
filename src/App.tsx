import React, { useState, Component } from 'react';
import type { ReactNode } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { LiveFoodMap } from './components/LiveFoodMap';
import { DonateFoodForm } from './components/DonateFoodForm';
import { DonorDashboard } from './components/DonorDashboard';
import { NGODashboard } from './components/NGODashboard';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DirectoryPage } from './components/DirectoryPage';
import { ImpactPage } from './components/ImpactPage';
import { AwarenessPage } from './components/AwarenessPage';
import { CertificateModal } from './components/CertificateModal';
import { DonationTrackerModal } from './components/DonationTrackerModal';
import { LoginPage } from './components/LoginPage';
import type { Certificate } from './types';
import { Award, Leaf, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("View rendering error caught by boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 my-8">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-xl font-black text-white">Live View Loading</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Reloading component view... If this persists, click the button below to refresh.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
          >
            Reload Website View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    certificates, 
    selectedDonationForTracking, 
    setSelectedDonationForTracking,
    authUser 
  } = useApp();

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  if (!authUser) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardOverview />;
      case 'map':
        return <LiveFoodMap />;
      case 'donate':
        return <DonateFoodForm />;
      case 'donor-dash':
        return <DonorDashboard />;
      case 'ngo-dash':
        return <NGODashboard />;
      case 'volunteer-dash':
        return <VolunteerDashboard />;
      case 'admin-dash':
        return <AdminDashboard />;
      case 'directory':
        return <DirectoryPage />;
      case 'impact':
        return <ImpactPage />;
      case 'awareness':
        return <AwarenessPage />;
      case 'certificates':
        return (
          <div className="space-y-8 animate-fadeIn pb-12">
            <div className="bg-gradient-to-r from-[#78350f] via-[#b45309] to-[#022c22] p-8 rounded-3xl border border-amber-800/40 shadow-xl space-y-3 text-white">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/30">
                <Award className="w-3.5 h-3.5" />
                <span>MILESTONE RECOGNITION</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Food Rescue Appreciation Certificates</h1>
              <p className="text-xs text-amber-100 font-medium max-w-2xl">
                Earned automatically at donation milestones (5th, 25th, 50th donation) for outstanding contribution to zero-hunger communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="p-6 rounded-2xl bg-white border border-amber-200 hover:border-amber-400 transition-all cursor-pointer space-y-4 shadow-xs group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
                      ★ MILESTONE AWARD ★
                    </span>
                    <Award className="w-6 h-6 text-amber-500 group-hover:rotate-12 transition-transform" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                      {cert.milestoneTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Presented to {cert.donorName}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                    <span className="text-emerald-600 font-bold underline">Click to View Certificate →</span>
                  </div>
                </div>
              ))}
            </div>

            <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Left Sidebar Menu */}
      <Sidebar />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <Header />

        {/* Scrollable Page Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
          <ErrorBoundary key={activeTab}>
            {renderActiveView()}
          </ErrorBoundary>
        </main>

        {/* Global Donation Tracker Modal */}
        <DonationTrackerModal
          donation={selectedDonationForTracking}
          onClose={() => setSelectedDonationForTracking(null)}
        />

        {/* Footer Matching Design Reference Image */}
        <footer className="border-t border-slate-200 bg-white py-4 px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-700">Food Waste Reduction Network</span>
              <span className="mx-2">|</span>
              <span>Community Engagement Project</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <Leaf className="w-3.5 h-3.5" />
              <span>Reduce Waste | Feed People | Build a Stronger Community</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
