
import React, { useState } from 'react';
import { generateLogoPreview } from '../services/gemini';

interface Props {
  businessName: string;
  niche: string;
  onComplete: (data: any) => void;
}

const LOGO_STYLES = [
  { id: 'minimal', label: 'Minimalist', icon: '✨' },
  { id: 'bold', label: 'Bold & Strong', icon: '💪' },
  { id: 'tech', label: 'Tech Futurist', icon: '⚡' },
  { id: 'luxury', label: 'Premium Luxury', icon: '💎' },
  { id: 'creative', label: 'Playful/Creative', icon: '🎨' },
];

export const StageFormLogo: React.FC<Props> = ({ businessName, niche, onComplete }) => {
  const [logoType, setLogoType] = useState<'AI' | 'HUMAN'>('AI');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerations, setRegenerations] = useState(0);
  const [customInstructions, setCustomInstructions] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(LOGO_STYLES[0].id);

  const handleGenerateAI = async () => {
    if (regenerations >= 15) return;
    setLoading(true);
    
    const styleObj = LOGO_STYLES.find(s => s.id === selectedStyle);
    const combinedInstructions = `${styleObj ? `Style: ${styleObj.label}. ` : ''}${customInstructions}`;
    
    const img = await generateLogoPreview(businessName || "New Venture", niche || "Business", combinedInstructions);
    setPreview(img);
    setLoading(false);
    setRegenerations(prev => prev + 1);
  };

  const panelBg = "bg-white dark:bg-slate-950 border border-black/10 dark:border-white/10 transition-colors shadow-sm dark:shadow-inner";

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl w-full sm:w-fit border border-black/5 dark:border-white/10 mx-auto lg:mx-0">
        <button 
          onClick={() => setLogoType('AI')}
          className={`flex-1 sm:flex-none px-6 py-3.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${logoType === 'AI' ? 'bg-[#EC1B23] text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
        >
          AI Engine (R70)
        </button>
        <button 
          onClick={() => setLogoType('HUMAN')}
          className={`flex-1 sm:flex-none px-6 py-3.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${logoType === 'HUMAN' ? 'bg-[#EC1B23] text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
        >
          Senior Designer (R350)
        </button>
      </div>

      {logoType === 'AI' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Controls Panel */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-5">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">1. Branding Archetype</h4>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LOGO_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-5 rounded-2xl border transition-all text-left group ${selectedStyle === style.id ? 'bg-[#EC1B23]/10 border-[#EC1B23] text-[#EC1B23] dark:text-white shadow-lg' : 'bg-white dark:bg-slate-950 border-black/5 dark:border-white/5 text-slate-500 hover:border-black/20 dark:hover:border-white/20'}`}
                    >
                      <div className="text-2xl mb-3">{style.icon}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest leading-none">{style.label}</div>
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">2. Explain Your Changes (Plain English)</label>
              <textarea 
                placeholder="e.g. 'Add a silhouette of an eagle', 'Make it look more premium', 'Use a circular layout'..."
                className={`w-full p-6 rounded-3xl text-slate-900 dark:text-white font-medium outline-none focus:border-[#EC1B23] transition-all min-h-[140px] md:min-h-[160px] resize-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-700 ${panelBg}`}
                value={customInstructions}
                onChange={e => setCustomInstructions(e.target.value)}
              />
            </div>

            <div className="space-y-5">
              <button 
                onClick={handleGenerateAI}
                disabled={loading || (regenerations >= 15)}
                className={`w-full py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl relative overflow-hidden group ${loading ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-wait' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-[#EC1B23] hover:text-white'}`}
              >
                <span className="relative z-10">{loading ? 'Synthesizing...' : preview ? 'Update Brand Identity' : 'Generate First Draft'}</span>
                {loading && <div className="absolute inset-0 bg-white/10 dark:bg-white/10 animate-pulse"></div>}
              </button>
              <div className="flex items-center justify-between px-4">
                 <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{15 - regenerations} iterations left</p>
                 <p className="text-[9px] font-black text-[#EC1B23] uppercase tracking-widest">Fixed Cost: R70</p>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex flex-col items-center gap-8 order-1 lg:order-2 w-full">
            <div className={`relative group p-4 sm:p-6 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-[4rem] shadow-2xl transition-all duration-500 w-full aspect-square max-w-[500px] flex items-center justify-center`}>
              <div className="absolute -inset-2 bg-gradient-to-br from-[#EC1B23]/20 to-transparent blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
              
              <div className={`relative w-full h-full rounded-[3rem] overflow-hidden flex items-center justify-center border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-slate-950 shadow-inner`}>
                {preview ? (
                  <>
                    <img src={preview} alt="Logo Preview" className={`w-full h-full object-contain transition-all duration-700 ${loading ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'}`} />
                    {!loading && (
                       <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 pointer-events-none">
                         <div className="text-center px-10">
                            <p className="mb-3">Marvetti Draft</p>
                            <p className="text-slate-500 dark:text-white/40 text-[8px] leading-relaxed">Secured Build ID: MVT-{Math.floor(Math.random()*100000)}</p>
                         </div>
                       </div>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-5">
                     <div className="text-6xl animate-bounce">🎨</div>
                     <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest block">Awaiting Synthesis</span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest block">Creative Module Initialized</span>
                     </div>
                  </div>
                )}
                
                {loading && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/40 dark:bg-slate-950/40">
                      <div className="w-12 h-12 border-4 border-[#EC1B23]/20 border-t-[#EC1B23] rounded-full animate-spin shadow-[0_0_15px_#EC1B23]"></div>
                      <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] animate-pulse">Processing Refinement...</span>
                   </div>
                )}
              </div>
            </div>
            
            {preview && !loading && (
              <div className="w-full space-y-5 animate-in slide-in-from-top-4 duration-500 max-w-[500px]">
                <button 
                  onClick={() => onComplete({ type: 'AI', preview, style: selectedStyle, instructions: customInstructions, price: 70 })}
                  className="w-full py-7 bg-emerald-600 text-white font-black rounded-[2.5rem] hover:bg-emerald-500 hover:scale-[1.02] transition-all shadow-2xl shadow-emerald-900/30 uppercase tracking-widest text-sm border border-white/10"
                >
                  Finalize Branding & Next Stage
                </button>
                <div className="flex items-center justify-center gap-3">
                   <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
                   <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ownership & High-Res Bundle included</p>
                   <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-10 md:p-24 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-[4rem] text-center space-y-12 relative overflow-hidden shadow-2xl transition-colors">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-[#EC1B23]/10 to-transparent blur-[120px] pointer-events-none"></div>
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#EC1B23] to-[#770E13] rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center text-5xl sm:text-7xl mx-auto shadow-2xl relative z-10 border border-white/10 animate-float">🏆</div>
          <div className="space-y-6 relative z-10">
             <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">Human Creative Protocol</h3>
             <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed text-base sm:text-xl">Skip the AI and collaborate directly with a senior brand architect. Includes 3 unique concepts, custom typography, and unlimited revisions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
             <div className="bg-slate-100 dark:bg-slate-950/60 px-8 py-5 rounded-2xl border border-black/5 dark:border-white/5 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 3 Original Concepts
             </div>
             <div className="bg-slate-100 dark:bg-slate-950/60 px-8 py-5 rounded-2xl border border-black/5 dark:border-white/5 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Unlimited Revisions
             </div>
          </div>
          <button 
            onClick={() => onComplete({ type: 'HUMAN', price: 350 })}
            className="w-full max-w-md py-8 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-[2.5rem] hover:scale-[1.05] active:scale-[0.95] transition-all shadow-2xl uppercase tracking-[0.2em] text-sm sm:text-base border border-black/5 dark:border-white/10 mx-auto"
          >
            Activate Human QC Module • R350
          </button>
        </div>
      )}
    </div>
  );
};
