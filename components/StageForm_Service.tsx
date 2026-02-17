
import React, { useState, useEffect } from 'react';
import { StageId } from '../types';

interface Props {
  stageId: StageId;
  stageName: string;
  description: string;
  price: string;
  niche?: string;
  onComplete: (data: any) => void;
}

const COMPLIANCE_MAP: Record<string, string[]> = {
  'Security Guarding': ['PSIRA Registration', 'COIDA (Letter of Good Standing)', 'UIF & PAYE Compliance', 'Public Liability Insurance'],
  'Construction & Building': ['CIDB Grading', 'NHBRC Registration', 'COIDA', 'B-BBEE Affidavit'],
  'Transport & Logistics': ['Public Transport Permits', 'PDP Renewals', 'GIT Insurance', 'Vehicle Tracking Setup'],
  'General Trading': ['CSD Registration', 'Tax Clearance Certificate', 'B-BBEE Certificate', 'Import/Export License'],
  'default': ['Tax Clearance Certificate', 'CSD Registration', 'UIF Registration', 'COIDA']
};

export const StageFormService: React.FC<Props> = ({ stageId, stageName, description, price, niche, onComplete }) => {
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<string[]>([]);

  const isProfile = stageId === StageId.PROFILE;
  const isPlan = stageId === StageId.PLAN;
  const isCompliance = stageId === StageId.COMPLIANCE;
  const isWeb = stageId === StageId.WEBSITE;
  const isSocial = stageId === StageId.SOCIAL;
  const isMarketing = stageId === StageId.MARKETING;
  const isCRM = stageId === StageId.CRM;
  const isMaintenance = stageId === StageId.MAINTENANCE;
  const isAdmin = stageId === StageId.REMOTE_ADMIN;

  const handleCheck = (item: string) => {
    setChecklist(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onComplete({ 
        instructions, 
        selectedOption, 
        checklist,
        timestamp: new Date().toISOString() 
      });
      setLoading(false);
    }, 800);
  };

  const renderStageSpecifics = () => {
    if (isProfile) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { id: 'text', label: 'Text Only', price: 'R400', desc: 'Copywriting & Structure' },
            { id: 'design', label: 'Text + Design', price: 'R650', desc: 'Full Branded PDF' }
          ].map(opt => (
            <button key={opt.id} type="button" onClick={() => setSelectedOption(opt.id)} className={`p-6 rounded-3xl border text-left transition-all ${selectedOption === opt.id ? 'bg-[#EC1B23]/10 border-[#EC1B23] shadow-lg' : 'bg-white dark:bg-slate-950 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedOption === opt.id ? 'text-[#EC1B23]' : 'text-slate-900 dark:text-white'}`}>{opt.label}</span>
                <span className="text-[#EC1B23] font-black text-[10px]">{opt.price}</span>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{opt.desc}</p>
            </button>
          ))}
        </div>
      );
    }

    if (isPlan) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { id: 'simple', label: 'Simple Plan', price: 'R650-R900', desc: 'Funding & Growth Focus' },
            { id: 'complex', label: 'Complex Logic', price: 'R1650-R2500', desc: 'Financial Projections+' }
          ].map(opt => (
            <button key={opt.id} type="button" onClick={() => setSelectedOption(opt.id)} className={`p-6 rounded-3xl border text-left transition-all ${selectedOption === opt.id ? 'bg-[#EC1B23]/10 border-[#EC1B23] shadow-lg' : 'bg-white dark:bg-slate-950 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedOption === opt.id ? 'text-[#EC1B23]' : 'text-slate-900 dark:text-white'}`}>{opt.label}</span>
                <span className="text-[#EC1B23] font-black text-[10px]">{opt.price}</span>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{opt.desc}</p>
            </button>
          ))}
        </div>
      );
    }

    if (isCompliance) {
      const items = COMPLIANCE_MAP[niche || ''] || COMPLIANCE_MAP['default'];
      return (
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map(item => (
              <label key={item} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${checklist.includes(item) ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white dark:bg-slate-950 border-black/5 dark:border-white/5'}`}>
                <input type="checkbox" checked={checklist.includes(item)} onChange={() => handleCheck(item)} className="w-5 h-5 rounded border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 text-[#EC1B23] focus:ring-[#EC1B23]" />
                <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{item}</span>
              </label>
            ))}
          </div>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest text-center">Protocol: Statutory Fees + 35% Service Fee</p>
        </div>
      );
    }

    if (isWeb) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {['Single Page', 'Corporate', 'E-commerce', 'App Landing', 'Funnel', 'Directory'].map(type => (
            <button key={type} type="button" onClick={() => setSelectedOption(type)} className={`p-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${selectedOption === type ? 'bg-[#EC1B23] text-white border-[#EC1B23]' : 'bg-white dark:bg-slate-950 border-black/5 dark:border-white/5 text-slate-500'}`}>
              {type}
            </button>
          ))}
        </div>
      );
    }

    if (isSocial) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {['Facebook', 'Instagram', 'LinkedIn', 'TikTok'].map(plat => (
             <label key={plat} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border cursor-pointer transition-all ${checklist.includes(plat) ? 'bg-emerald-500/10 border-emerald-500 shadow-md' : 'bg-white dark:bg-slate-950 border-black/5 dark:border-white/5'}`}>
                <input type="checkbox" className="hidden" checked={checklist.includes(plat)} onChange={() => handleCheck(plat)} />
                <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{plat}</span>
                <span className="text-[8px] font-bold text-slate-500">R350+</span>
             </label>
          ))}
        </div>
      )
    }

    return null;
  };

  const getPriceLabel = () => {
    if (isCompliance) return "Statutory Fees + 35%";
    if (isAdmin) return "R115 / Hour";
    if (isMaintenance) return "From R150 / Task";
    return price;
  };

  const inputClasses = "w-full p-8 bg-white dark:bg-slate-950 border border-black/10 dark:border-white/10 rounded-[2.5rem] text-slate-900 dark:text-white font-medium outline-none focus:border-[#EC1B23] transition-all min-h-[160px] resize-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-700 shadow-inner";

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{stageName.split('. ')[1]}</h3>
          <span className="text-[#EC1B23] font-black text-xs tracking-widest bg-red-600/5 px-4 py-2 rounded-full border border-red-600/10">
            {getPriceLabel()}
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl text-sm">{description}</p>
      </div>

      <div className="space-y-6">
        {renderStageSpecifics()}

        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
            {isCompliance ? 'Additional Compliance Notes' : 'Project Requirements & Custom Instructions'}
          </label>
          <textarea
            required={!isCompliance}
            placeholder={isCompliance ? "List any other specific licenses or permits required for your site operations..." : "Tell us exactly what you need for this stage..."}
            className={inputClasses}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-7 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-[2rem] hover:bg-[#EC1B23] hover:text-white transition-all shadow-2xl uppercase tracking-[0.2em] text-xs relative overflow-hidden group"
        >
          <span className="relative z-10">{loading ? 'Submitting Protocol...' : 'Initialize Stage & Submit Details'}</span>
          {!loading && <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>}
        </button>
        <div className="flex items-center justify-center gap-4 mt-6">
           <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
           <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">
              Protocol {stageId}.0 Sync Enabled
           </p>
           <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
        </div>
      </div>
    </form>
  );
};
