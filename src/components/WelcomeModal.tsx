import React from 'react';
import {
  Shield, Bot, Rss, MapPin, Activity, CheckCircle2, ChevronRight, X, PhoneCall
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAI: () => void;
}

export function WelcomeModal({ isOpen, onClose, onOpenAI }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden transition-all transform duration-300 animate-fadeIn my-auto z-10">
        
        {/* Header */}
        <div className="relative bg-white dark:bg-zinc-950 p-6 sm:p-8 border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Ghana Cyber Monitor 🇬🇭
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            Welcome to Ghana Cyber News Monitor
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 font-medium max-w-xl leading-relaxed">
            Your centralized portal for verified Ghanaian cybersecurity advisories, RSS threat news aggregation, and live AI guidance.
          </p>
        </div>

        {/* Modal Body - Key Features */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto font-sans">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3.5 transition-all hover:border-blue-500/40">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Rss className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-900 dark:text-white">Verified Local Feeds</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal font-medium">
                  Aggregating MyJoyOnline, Citi Newsroom, Graphic, CSA Ghana &amp; GNA every 5 minutes.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3.5 transition-all hover:border-amber-500/40">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-900 dark:text-white">Threat Level Intelligence</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal font-medium">
                  Automated categorization into Ransomware, Phishing, MoMo Fraud, and Data Breaches.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3.5 transition-all hover:border-emerald-500/40">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-900 dark:text-white">Regional Breakdown</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal font-medium">
                  Filter threats by Greater Accra, Ashanti, Northern, Volta, and all 16 Ghanaian regions.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3.5 transition-all hover:border-cyan-500/40">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-900 dark:text-white">Feed Health Monitoring</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal font-medium">
                  Live uptime status monitoring of all news endpoints.
                </p>
              </div>
            </div>

          </div>

          {/* AI Feature Spotlight */}
          <div className="relative rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-cyan-500/30 p-5 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">CyberGuard AI Assistant</h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Live AI</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5 leading-normal font-medium">
                  Ask security questions, check MoMo fraud alerts, or get incident response advice 24/7.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenAI();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Chat with AI</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Emergency Advisory Quick Note */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <PhoneCall className="w-4 h-4" />
              <span>Ghana CSA Emergency Hotline: Call/SMS 292</span>
            </div>
            <span className="text-zinc-400">csa.gov.gh</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Get Started &amp; Explore Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
}
