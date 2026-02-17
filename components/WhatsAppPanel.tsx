
import React from 'react';

interface Props {
  message: string;
}

export const WhatsAppPanel: React.FC<Props> = ({ message }) => {
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <div className="glass-panel rounded-[3.5rem] overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
      <div className="p-8 md:p-10 border-b border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.988 0 1.758.459 3.474 1.33 4.988L2 22l5.167-1.357c1.47.8 3.113 1.22 4.807 1.22 5.507 0 9.987-4.479 9.987-9.987 0-5.508-4.479-9.988-9.987-9.988z"/></svg>
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight uppercase text-lg">
              Marvetti Command Feed
            </h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Direct Uplink to Operations Team</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-1.5 items-center px-4 py-2 rounded-full bg-white dark:bg-slate-950 border border-black/5 dark:border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]"></span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>
      
      <div className="p-8 md:p-12 space-y-8">
        <div className="space-y-4">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Protocol Message Payload</label>
           {message ? (
             <div className="bg-white dark:bg-slate-950/50 p-8 md:p-10 rounded-[2.5rem] text-sm md:text-base border border-black/5 dark:border-white/5 text-slate-700 dark:text-slate-300 leading-relaxed font-medium shadow-inner">
               {message}
             </div>
           ) : (
             <div className="bg-slate-100 dark:bg-slate-950/30 p-16 rounded-[2.5rem] text-center border border-dashed border-black/10 dark:border-white/10 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center text-3xl grayscale opacity-20">📡</div>
                <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] italic">Awaiting Module Data for Uplink Generation</p>
             </div>
           )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 flex flex-col justify-center">
              <h4 className="text-[10px] font-black text-[#EC1B23] uppercase tracking-[0.2em] mb-2">Transmission Note</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Clicking the broadcast button will open WhatsApp with your pre-filled status report. You may manually refine the payload before final transmission to our team.</p>
           </div>
           
           <div className="flex items-end">
             <a 
               href={waUrl}
               target="_blank"
               rel="noopener noreferrer"
               className={`group relative flex items-center justify-center gap-3 w-full py-6 rounded-2xl transition-all shadow-2xl overflow-hidden active:scale-95 border border-white/10 font-black ${message ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed pointer-events-none'}`}
             >
               <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.988 0 1.758.459 3.474 1.33 4.988L2 22l5.167-1.357c1.47.8 3.113 1.22 4.807 1.22 5.507 0 9.987-4.479 9.987-9.987 0-5.508-4.479-9.988-9.987-9.988z"/></svg>
               <span className="relative z-10 text-[11px] uppercase tracking-[0.2em]">Broadcast to Ops</span>
               <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
             </a>
           </div>
        </div>
      </div>
    </div>
  );
};
