
import React, { useState, useEffect, useRef } from 'react';
import { StageId, ApplicationState, ClientData, StageInfo } from './types';
import { STAGES_CONFIG, COLORS, NICHES } from './constants';
import { StageFormRegistration } from './components/StageForm_Registration';
import { StageFormLogo } from './components/StageForm_Logo';
import { StageFormService } from './components/StageForm_Service';
import { WhatsAppPanel } from './components/WhatsAppPanel';
import { generateStageSummary, generateWhatsAppDraft } from './services/gemini';

const STORAGE_KEY = 'marvetti_app_state';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative border border-white/10 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h3 className="text-2xl font-black mb-8 text-white tracking-tight uppercase">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', cell: '' });
  const [state, setState] = useState<ApplicationState>(() => {
    return {
      client: null,
      currentStage: StageId.REGISTRATION,
      stages: STAGES_CONFIG,
      isAdminMode: false,
      whatsappDraft: ''
    };
  });

  const [stageSummary, setStageSummary] = useState<string>('');
  const [lastSubmissionNiche, setLastSubmissionNiche] = useState<string>('');
  const dashboardTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: ApplicationState = JSON.parse(saved);
        if (parsed.client) {
          setState(parsed);
          setView('dashboard');
        }
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && state.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: ClientData = { ...formData, status: 'ACTIVE' };
    setState(prev => ({ ...prev, client: newClient }));
    setIsSignUpOpen(false);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStageComplete = async (stageId: StageId, data: any) => {
    if (stageId === StageId.REGISTRATION) {
       setLastSubmissionNiche(data.niche);
    }

    setState(prev => {
      const updatedStages = { ...prev.stages };
      updatedStages[stageId].status = 'COMPLETED';
      
      const nextId = (stageId + 1) as StageId;
      if (STAGES_CONFIG[nextId]) {
        updatedStages[nextId].isUnlocked = true;
      }
      
      const updatedClient = { ...prev.client };
      if (stageId === StageId.REGISTRATION && updatedClient) {
        updatedClient.companyName = data.isExisting ? data.existingName : data.names[0];
        updatedClient.status = 'ACTIVE';
      }

      return { 
        ...prev, 
        stages: updatedStages, 
        client: updatedClient as ClientData,
        currentStage: STAGES_CONFIG[nextId] ? nextId : stageId
      };
    });

    const summary = await generateStageSummary(state.stages[stageId].name, data);
    setStageSummary(summary);
    
    if (state.client) {
      const wa = await generateWhatsAppDraft(state.stages[stageId].name, state.client.firstName);
      setState(prev => ({ ...prev, whatsappDraft: wa }));
    }

    dashboardTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  const resetSession = () => {
    if (confirm("This will clear your local dashboard records. Are you sure?")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#020617] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#EC1B23]/20 border-t-[#EC1B23] rounded-full animate-spin"></div>
  </div>;

  const renderLandingPage = () => (
    <div className="bg-[#020617] min-h-screen text-slate-200 bg-grid animate-in fade-in duration-1000">
      <nav className="fixed top-0 z-50 w-full px-6 py-8 flex items-center justify-between pointer-events-none">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3 glass-panel px-5 py-2.5 rounded-2xl cursor-pointer hover:scale-105 transition-all" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#EC1B23] to-[#770E13] rounded-lg flex items-center justify-center text-white font-black shadow-lg">M</div>
            <h1 className="text-xl font-black tracking-tighter">MARVETTI<span className="text-[#EC1B23]">.AI</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsQuoteOpen(true)} className="hidden sm:block px-6 py-3 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white">Get Quote</button>
            <button onClick={() => setIsSignUpOpen(true)} className="px-6 py-3 bg-[#EC1B23] text-white text-[10px] font-black rounded-xl hover:scale-105 active:scale-95 transition-all glow-red shadow-lg uppercase tracking-widest">Sign Up Free</button>
          </div>
        </div>
      </nav>

      <header className="relative px-6 pt-48 pb-56 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-20 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass-panel rounded-full text-[10px] font-black text-[#EC1B23] uppercase tracking-[0.3em] mb-12">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EC1B23] shadow-[0_0_8px_#EC1B23]"></span>
            Built for South Africa
          </div>
          <h2 className="text-6xl md:text-[9rem] font-black leading-[0.85] mb-12 tracking-tighter text-white uppercase">
            Start your<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC1B23] via-red-500 to-[#770E13]">Business fast.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-16 font-medium leading-relaxed">
            One easy dashboard. 12 smart steps. Everything you need to grow your company, simple and automated.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <button onClick={() => setIsSignUpOpen(true)} className="w-full md:w-auto px-16 py-6 bg-gradient-to-br from-[#EC1B23] to-[#770E13] text-white text-xl font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all glow-red shadow-2xl">Create My Dashboard</button>
            <button onClick={() => setIsQuoteOpen(true)} className="w-full md:w-auto px-16 py-6 glass-button text-white text-xl font-black rounded-[2rem]">Calculate Roadmap</button>
          </div>
        </div>
      </header>

      <section className="py-40 px-6 border-y border-white/5">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { t: "Fast & Official", d: "We handle all the CIPC paperwork so you can focus on working.", icon: "🚀" },
              { t: "Human Support", d: "Real people are always ready to help you on WhatsApp 24/7.", icon: "💬" },
              { t: "Ready to Grow", d: "Get logos, websites, and sales tools built by our expert AI system.", icon: "📈" }
            ].map((c, i) => (
              <div key={i} className="glass-panel p-12 rounded-[3rem] border border-white/5 hover:border-[#EC1B23]/30 transition-all group hover:-translate-y-2 duration-500">
                 <div className="text-5xl mb-10 group-hover:scale-110 transition-transform origin-left">{c.icon}</div>
                 <h4 className="text-3xl font-black mb-6 text-white uppercase tracking-tight">{c.t}</h4>
                 <p className="text-slate-400 text-lg leading-relaxed font-medium">{c.d}</p>
              </div>
            ))}
         </div>
      </section>

      <footer className="py-32 px-6 flex flex-col items-center text-center">
         <div className="w-16 h-16 bg-gradient-to-br from-[#EC1B23] to-[#770E13] rounded-2xl flex items-center justify-center text-white font-black text-3xl mb-12 shadow-xl">M</div>
         <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-12 uppercase">Own your future.</h2>
         <p className="text-slate-500 font-bold text-sm tracking-[0.3em] uppercase mb-16">© 2025 MARVETTI.AI • SIMPLE BUSINESS SOLUTIONS</p>
      </footer>

      <Modal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} title="Dashboard Enrollment">
         <form onSubmit={handleSignUpSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
               <input required placeholder="FIRST NAME" className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-[#EC1B23] text-sm" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
               <input required placeholder="SURNAME" className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-[#EC1B23] text-sm" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <input required type="email" placeholder="EMAIL ADDRESS" className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-[#EC1B23] text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required type="tel" placeholder="WHATSAPP NUMBER" className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-[#EC1B23] text-sm" value={formData.cell} onChange={e => setFormData({...formData, cell: e.target.value})} />
            <button type="submit" className="w-full py-6 bg-gradient-to-r from-[#EC1B23] to-[#770E13] text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all mt-6 glow-red shadow-xl uppercase tracking-[0.2em] text-[10px]">Initialize Dashboard</button>
         </form>
      </Modal>

      <Modal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} title="Strategic Roadmap">
         <div className="space-y-6">
            <select className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl text-white font-bold appearance-none outline-none focus:border-[#EC1B23] text-sm">
               <option>I need to register a new company</option>
               <option>I already have a company</option>
               <option>I want to start a Non-Profit (NPO)</option>
            </select>
            <select className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl text-white font-bold appearance-none outline-none focus:border-[#EC1B23] text-sm">
               {NICHES.map(n => <option key={n}>{n.toUpperCase()}</option>)}
            </select>
            <div className="bg-red-600/5 p-8 rounded-3xl border border-red-600/10">
               <p className="text-xs text-slate-400 font-medium leading-relaxed">Most registrations start at R495. Sign up now to see your full success path.</p>
            </div>
            <button onClick={() => setIsSignUpOpen(true)} className="w-full py-6 bg-white text-slate-900 font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-[10px]">Start Success Path</button>
         </div>
      </Modal>
    </div>
  );

  const renderDashboard = () => {
    const currentStageInfo = state.stages[state.currentStage];

    return (
      <div className="bg-[#020617] h-screen flex flex-col text-slate-200 animate-in fade-in duration-700">
        <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-6 md:px-10 shrink-0 z-50">
          <div className="flex items-center gap-6 md:gap-10">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
               <div className="w-10 h-10 bg-gradient-to-br from-[#EC1B23] to-[#770E13] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">M</div>
               <h1 className="text-xl font-black tracking-tighter hidden sm:block uppercase">MARVETTI<span className="text-[#EC1B23]">.AI</span></h1>
            </div>
            <div className="h-8 w-px bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white font-black text-sm border border-white/5 shadow-inner">
                {state.client?.firstName[0]}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-black uppercase text-white tracking-tight leading-none">{state.client?.firstName} {state.client?.lastName}</p>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Business Owner</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden xl:flex gap-2 items-center">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${i + 1 <= state.currentStage ? 'bg-[#EC1B23] shadow-[0_0_8px_#EC1B23]' : 'bg-white/10'}`}></div>
                ))}
             </div>
             <button onClick={resetSession} className="px-5 py-2.5 glass-button rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-[#EC1B23] border-white/5">Reset Session</button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
          <aside className={`fixed inset-0 z-40 lg:relative lg:z-0 lg:flex w-80 glass-panel border-r-0 flex-col transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="h-full bg-slate-950 lg:bg-transparent flex flex-col">
              <div className="p-8 lg:mt-0 mt-20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Milestone Progress</h4>
                  <span className="text-[10px] font-black text-[#EC1B23]">{Math.round((state.currentStage / 12) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-[#EC1B23] to-red-500 transition-all duration-1000 shadow-[0_0_10px_#EC1B23]" style={{ width: `${(state.currentStage / 12) * 100}%` }}></div>
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {Object.values(state.stages).map((s: StageInfo) => (
                  <button
                    key={s.id}
                    disabled={!s.isUnlocked && !state.isAdminMode}
                    onClick={() => {
                      setState(prev => ({...prev, currentStage: s.id}));
                      setStageSummary(''); 
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all group relative overflow-hidden ${
                      state.currentStage === s.id 
                      ? 'bg-gradient-to-br from-[#EC1B23] to-[#770E13] text-white shadow-xl' 
                      : (s.isUnlocked ? 'hover:bg-white/5 text-slate-400' : 'opacity-10 grayscale cursor-not-allowed')
                    }`}
                  >
                    <div className="flex flex-col relative z-10">
                      <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${state.currentStage === s.id ? 'text-white/60' : 'text-[#EC1B23]'}`}>Module 0{s.id}</span>
                      <span className="font-black text-xs uppercase tracking-tight">{s.name.split('. ')[1]}</span>
                    </div>
                    {s.status === 'COMPLETED' ? (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    ) : s.isUnlocked && (
                      <div className={`w-1.5 h-1.5 rounded-full ${state.currentStage === s.id ? 'bg-white shadow-lg' : 'bg-[#EC1B23]'} animate-pulse`}></div>
                    )}
                  </button>
                ))}
              </nav>
              <div className="p-6">
                <button onClick={() => setState(prev => ({...prev, isAdminMode: !prev.isAdminMode}))} className="w-full p-4 glass-button text-[9px] font-black uppercase tracking-widest rounded-2xl text-slate-500 border-white/5">
                  {state.isAdminMode ? 'View as Customer' : 'Internal Staff Override'}
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 flex flex-col overflow-hidden relative">
             <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
             <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 relative z-10 custom-scrollbar" ref={dashboardTopRef}>
                <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
                   <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 px-4 py-1.5 glass-panel text-[10px] font-black text-[#EC1B23] rounded-full uppercase tracking-widest border border-white/5">
                         Active Module • Stage {state.currentStage}
                      </div>
                      <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">{currentStageInfo.name.split('. ')[1]}</h2>
                      <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">{currentStageInfo.description}</p>
                   </div>

                   {state.isAdminMode && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
                         <div className="p-6 bg-amber-600/10 border border-amber-600/20 rounded-3xl">
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-2">Compliance Risk</span>
                            <p className="text-white font-black text-xs">MEDIUM</p>
                         </div>
                         <div className="p-6 bg-emerald-600/10 border border-emerald-600/20 rounded-3xl">
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-2">SLA Progress</span>
                            <p className="text-white font-black text-xs">ON TRACK (14m)</p>
                         </div>
                         <div className="p-6 bg-blue-600/10 border border-blue-600/20 rounded-3xl">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-2">Upsell Signal</span>
                            <p className="text-white font-black text-xs">REGULATED NICHE</p>
                         </div>
                      </div>
                   )}

                   <div className="glass-panel rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden border border-white/5">
                      <div className="relative z-10">
                        {state.currentStage === StageId.REGISTRATION && (
                          <StageFormRegistration initialClientData={state.client} onComplete={(data) => handleStageComplete(StageId.REGISTRATION, data)} />
                        )}
                        {state.currentStage === StageId.LOGO && (
                          <StageFormLogo businessName={state.client?.companyName || "NEW VENTURE"} niche="BUSINESS" onComplete={(data) => handleStageComplete(StageId.LOGO, data)} />
                        )}
                        {state.currentStage > StageId.LOGO && (
                          <StageFormService 
                            stageId={state.currentStage}
                            stageName={currentStageInfo.name} 
                            description={currentStageInfo.description} 
                            price={currentStageInfo.price}
                            niche={lastSubmissionNiche}
                            onComplete={(data) => handleStageComplete(state.currentStage, data)} 
                          />
                        )}
                      </div>
                   </div>

                   {stageSummary && (
                     <div className="animate-in slide-in-from-bottom-12 duration-700">
                       <div className="flex items-center gap-5 mb-8">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EC1B23] to-[#770E13] flex items-center justify-center shadow-2xl shadow-red-500/30 border border-white/10">
                             <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-2xl font-black text-white uppercase tracking-tight">Status Report</h4>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Sync Complete</p>
                          </div>
                       </div>
                       <div 
                         className="prose prose-invert max-w-none glass-panel p-8 md:p-16 rounded-[3.5rem] shadow-2xl font-medium leading-relaxed border border-white/5"
                         dangerouslySetInnerHTML={{ __html: stageSummary }}
                       />
                     </div>
                   )}

                   <WhatsAppPanel message={state.whatsappDraft} />
                </div>
             </div>
          </main>
        </div>
      </div>
    );
  };

  return view === 'landing' ? renderLandingPage() : renderDashboard();
};

export default App;
