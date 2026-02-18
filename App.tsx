
// Completed the App component to handle stage transitions and AI data generation
import React, { useState, useEffect } from 'react';
import { StageId, ApplicationState, ClientData, StageInfo } from './types.ts';
import { STAGES_CONFIG } from './constants.ts';
import { StageFormRegistration } from './components/StageForm_Registration.tsx';
import { StageFormLogo } from './components/StageForm_Logo.tsx';
import { StageFormService } from './components/StageForm_Service.tsx';
import { WhatsAppPanel } from './components/WhatsAppPanel.tsx';
import { generateStageSummary, generateWhatsAppDraft } from './services/gemini.ts';

const STORAGE_KEY = 'marvetti_app_state';

// Component for theme switching between light and dark modes
const ThemeToggle: React.FC<{ theme: 'light' | 'dark'; onToggle: () => void }> = ({ theme, onToggle }) => (
  <button 
    onClick={onToggle}
    className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-slate-500 hover:text-[#EC1B23] transition-all"
    title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
  >
    {theme === 'light' ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
    )}
  </button>
);

const App: React.FC = () => {
  const [state, setState] = useState<ApplicationState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      client: null,
      currentStage: StageId.REGISTRATION,
      stages: STAGES_CONFIG,
      isAdminMode: false,
      whatsappDraft: '',
      theme: 'dark'
    };
  });

  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const handleStageComplete = async (data: any) => {
    setIsGenerating(true);
    const currentStageInfo = state.stages[state.currentStage];
    
    // Update stage status
    const updatedStages = { ...state.stages };
    updatedStages[state.currentStage].status = 'COMPLETED';
    
    // Unlock next stage
    const nextStageId = state.currentStage + 1;
    if (updatedStages[nextStageId as StageId]) {
      updatedStages[nextStageId as StageId].isUnlocked = true;
    }

    // Update client data if it's the registration stage
    let updatedClient = state.client;
    if (state.currentStage === StageId.REGISTRATION) {
      updatedClient = {
        firstName: data.directors?.[0]?.fullName?.split(' ')[0] || 'Client',
        lastName: data.directors?.[0]?.fullName?.split(' ').slice(1).join(' ') || '',
        email: data.directors?.[0]?.email || '',
        cell: data.directors?.[0]?.cell || '',
        companyName: data.existingName || data.names?.[0],
        status: 'PENDING'
      };
    }

    try {
      // Generate AI assets using Gemini API
      const [summary, waDraft] = await Promise.all([
        generateStageSummary(currentStageInfo.name, data),
        generateWhatsAppDraft(currentStageInfo.name, updatedClient?.firstName || 'Client')
      ]);

      setAiSummary(summary);
      setState(prev => ({
        ...prev,
        client: updatedClient,
        stages: updatedStages,
        whatsappDraft: waDraft,
        currentStage: nextStageId <= 12 ? (nextStageId as StageId) : prev.currentStage
      }));
    } catch (error) {
      console.error("Error finalizing stage:", error);
    } finally {
      setIsGenerating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentStageInfo = state.stages[state.currentStage];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 font-sans selection:bg-[#EC1B23] selection:text-white pb-20">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EC1B23] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/20">M</div>
            <span className="font-black text-slate-900 dark:text-white tracking-tighter text-xl uppercase">Marvetti<span className="text-[#EC1B23]">.AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={state.theme} onToggle={() => setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))} />
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5">
              <div className="w-2 h-2 rounded-full bg-[#EC1B23] animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol 3.0 Active</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* Progress Dashboard */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-[11px] font-black text-[#EC1B23] uppercase tracking-[0.3em]">Operational Roadmap</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Project Console</p>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
               <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">👤</div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Authenticated As</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase truncate max-w-[150px]">
                    {state.client ? `${state.client.firstName} ${state.client.lastName}` : 'Guest User'}
                  </p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(Object.values(state.stages) as StageInfo[]).map(s => (
              <button 
                key={s.id}
                disabled={!s.isUnlocked}
                onClick={() => setState(prev => ({ ...prev, currentStage: s.id }))}
                className={`p-6 rounded-[2.5rem] border transition-all text-left relative group overflow-hidden ${
                  state.currentStage === s.id 
                    ? 'bg-white dark:bg-white border-[#EC1B23] shadow-2xl scale-105 z-10' 
                    : s.status === 'COMPLETED'
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : s.isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-black/5 dark:border-white/5 hover:border-[#EC1B23]/30'
                    : 'bg-slate-100 dark:bg-slate-950/50 border-black/5 dark:border-white/5 opacity-50 grayscale cursor-not-allowed'
                }`}
              >
                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${state.currentStage === s.id ? 'text-[#EC1B23]' : s.status === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {s.status === 'COMPLETED' ? '✓ Stage ' : 'Phase '}{s.id}
                </div>
                <div className={`text-[10px] font-black uppercase tracking-tight leading-tight ${state.currentStage === s.id ? 'text-slate-900' : 'text-slate-600 dark:text-slate-400'}`}>
                  {s.name.split('. ')[1]}
                </div>
                {state.currentStage === s.id && (
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-[#EC1B23]"></div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Current Stage Area */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 md:p-16 border border-black/5 dark:border-white/5 shadow-2xl transition-all">
              {state.currentStage === StageId.REGISTRATION && (
                <StageFormRegistration initialClientData={state.client} onComplete={handleStageComplete} />
              )}
              {state.currentStage === StageId.LOGO && (
                <StageFormLogo businessName={state.client?.companyName || ''} niche={''} onComplete={handleStageComplete} />
              )}
              {state.currentStage > StageId.LOGO && (
                <StageFormService 
                  stageId={state.currentStage}
                  stageName={currentStageInfo.name}
                  description={currentStageInfo.description}
                  price={currentStageInfo.price}
                  onComplete={handleStageComplete}
                />
              )}
            </div>

            {aiSummary && (
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 md:p-16 border border-black/5 dark:border-white/5 shadow-2xl animate-in slide-in-from-top-8 duration-700">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-black/5 dark:border-white/5">
                   <div className="w-12 h-12 rounded-2xl bg-[#EC1B23]/10 flex items-center justify-center text-2xl">📋</div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Stage Logic Summary</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">AI Generated Execution Report</p>
                   </div>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none prose-sm md:prose-base" dangerouslySetInnerHTML={{ __html: aiSummary }} />
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <WhatsAppPanel message={state.whatsappDraft} />
            
            <div className="rounded-[2.5rem] p-8 bg-[#EC1B23] text-white border border-white/10 shadow-2xl shadow-red-500/20">
               <div className="text-3xl mb-4">🚀</div>
               <h4 className="font-black uppercase tracking-tight text-xl mb-2">Turbo Boost</h4>
               <p className="text-white/80 text-sm font-medium leading-relaxed">Submit your data and our operations team will prioritize your registration within 2 hours.</p>
            </div>
            
            <div className="rounded-[2.5rem] p-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-black/5 dark:border-white/5">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#EC1B23] flex items-center justify-center text-xs font-black text-white">?</div>
                  <h4 className="font-black uppercase tracking-widest text-[10px]">Need Assistance?</h4>
               </div>
               <p className="text-xs font-medium opacity-70 mb-6 leading-relaxed">Our protocol support agents are standing by to assist with your business setup.</p>
               <button className="w-full py-4 bg-white/10 dark:bg-black/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 dark:border-black/5 hover:bg-white/20 transition-all">
                 Live Chat Support
               </button>
            </div>
          </aside>
        </section>
      </main>

      {isGenerating && (
        <div className="fixed inset-0 z-[200] bg-[#020617]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500">
           <div className="relative">
              <div className="w-32 h-32 border-8 border-red-600/10 border-t-[#EC1B23] rounded-full animate-spin shadow-[0_0_50px_rgba(236,27,35,0.3)]"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🤖</div>
           </div>
           <div className="text-center space-y-4 px-6">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Syncing Protocol</h3>
              <div className="flex flex-col items-center gap-2">
                 <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Gemini Analysis in Progress</p>
                 </div>
                 <p className="text-xs text-white/40 font-medium italic">Finalizing stage details...</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
