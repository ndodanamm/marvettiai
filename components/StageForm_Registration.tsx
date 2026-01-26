
import React, { useState, useEffect } from 'react';
import { NICHES } from '../constants';
import { Director, ClientData } from '../types';

interface Props {
  initialClientData?: ClientData | null;
  onComplete: (data: any) => void;
}

const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
];

export const StageFormRegistration: React.FC<Props> = ({ initialClientData, onComplete }) => {
  const [isExisting, setIsExisting] = useState(false);
  const [directors, setDirectors] = useState<Director[]>([{
    id: '1',
    fullName: initialClientData ? `${initialClientData.firstName} ${initialClientData.lastName}` : '',
    idNumber: '',
    nationality: 'South African',
    email: initialClientData?.email || '',
    cell: initialClientData?.cell || '',
    address: '',
    city: '',
    postalCode: '',
    province: 'Gauteng'
  }]);

  const [formData, setFormData] = useState({
    companyStatus: 'Not Registered',
    names: ['', '', '', ''],
    existingName: '',
    address: '',
    city: '',
    postalCode: '',
    province: 'Gauteng',
    niche: NICHES[0],
    description: '',
    uif: 'No',
    bank: 'No'
  });

  const addDirector = () => {
    if (directors.length >= 50) return;
    setDirectors([...directors, {
      id: Math.random().toString(),
      fullName: '',
      idNumber: '',
      nationality: 'South African',
      email: '',
      cell: '',
      address: '',
      city: '',
      postalCode: '',
      province: 'Gauteng'
    }]);
  };

  const removeDirector = (id: string) => {
    if (directors.length === 1) return;
    setDirectors(directors.filter(d => d.id !== id));
  };

  const updateDirector = (id: string, field: keyof Director, value: string) => {
    setDirectors(directors.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ ...formData, directors, isExisting, niche: formData.niche });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h3 className="text-2xl font-black text-white uppercase tracking-tight">Stage 1: Registration Profile</h3>
           <span className="text-[#EC1B23] font-black text-sm tracking-widest bg-red-600/5 px-4 py-1.5 rounded-full border border-red-600/10">R495.00</span>
        </div>
        
        <div className="flex p-1 bg-slate-950 border border-white/10 rounded-2xl w-full sm:w-fit">
          <button 
            type="button"
            onClick={() => { setIsExisting(false); setFormData({...formData, companyStatus: 'Not Registered'}); }}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isExisting ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
          >
            New Company
          </button>
          <button 
            type="button"
            onClick={() => { setIsExisting(true); setFormData({...formData, companyStatus: 'Already Registered'}); }}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isExisting ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
          >
            Existing Entity
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!isExisting ? (
            <div className="space-y-4 md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Proposed Names (Priority Order)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.names.map((name, i) => (
                  <input 
                    key={i} required={i === 0}
                    type="text" placeholder={`Option ${i+1}: NAME PTY LTD`}
                    className="p-5 bg-slate-950 border border-white/10 rounded-2xl text-white outline-none focus:border-[#EC1B23] font-bold text-sm shadow-inner"
                    value={name} onChange={(e) => {
                      const newNames = [...formData.names];
                      newNames[i] = e.target.value;
                      setFormData({...formData, names: newNames});
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Existing Registered Name</label>
              <input required type="text" placeholder="ENTER REGISTERED COMPANY NAME" className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl text-white outline-none focus:border-[#EC1B23] font-bold shadow-inner" value={formData.existingName} onChange={e => setFormData({...formData, existingName: e.target.value})} />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Niche</label>
            <select className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl text-white outline-none focus:border-[#EC1B23] font-bold appearance-none cursor-pointer" value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})}>
              {NICHES.map(n => <option key={n}>{n.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Short Description</label>
            <input required type="text" placeholder="e.g. Security services and guarding..." className="w-full p-5 bg-slate-950 border border-white/10 rounded-2xl text-white outline-none focus:border-[#EC1B23] font-bold shadow-inner" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-950/30 p-8 rounded-[2.5rem] border border-white/5">
          <div className="sm:col-span-2 space-y-2">
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registered Street Address</label>
             <input required type="text" className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-[#EC1B23] font-bold text-sm" placeholder="123 Alpha Road" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className="space-y-2">
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">City</label>
             <input required type="text" className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-[#EC1B23] font-bold text-sm" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>
          <div className="space-y-2">
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Post Code</label>
             <input required type="text" className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-[#EC1B23] font-bold text-sm" placeholder="0000" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
          </div>
          <div className="sm:col-span-4 space-y-2">
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Province</label>
             <select className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-[#EC1B23] font-bold appearance-none cursor-pointer text-sm" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})}>
               {PROVINCES.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
             </select>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Directors ({directors.length})</h3>
          <button type="button" onClick={addDirector} className="px-5 py-2.5 bg-[#EC1B23] rounded-xl text-[10px] font-black text-white hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-lg shadow-red-500/20">
            + New Member
          </button>
        </div>

        <div className="space-y-8">
          {directors.map((d, index) => (
            <div key={d.id} className="p-8 md:p-10 bg-slate-950/40 border border-white/5 rounded-[3rem] relative animate-in zoom-in-95 duration-300">
              {directors.length > 1 && (
                <button type="button" onClick={() => removeDirector(d.id)} className="absolute top-8 right-8 text-slate-500 hover:text-[#EC1B23] transition-colors p-2 hover:bg-white/5 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-[10px] font-black text-[#EC1B23] border border-red-600/20">0{index + 1}</div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Authorized Official</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Full Legal Name</label>
                   <input required className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white font-bold text-xs outline-none focus:border-[#EC1B23] shadow-inner" value={d.fullName} onChange={e => updateDirector(d.id, 'fullName', e.target.value)} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">ID / Passport</label>
                   <input required className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white font-bold text-xs outline-none focus:border-[#EC1B23] shadow-inner" value={d.idNumber} onChange={e => updateDirector(d.id, 'idNumber', e.target.value)} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Nationality</label>
                   <input required className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white font-bold text-xs outline-none focus:border-[#EC1B23] shadow-inner" value={d.nationality} onChange={e => updateDirector(d.id, 'nationality', e.target.value)} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Email</label>
                   <input required type="email" className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white font-bold text-xs outline-none focus:border-[#EC1B23] shadow-inner" value={d.email} onChange={e => updateDirector(d.id, 'email', e.target.value)} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">WhatsApp Cell</label>
                   <input required type="tel" className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white font-bold text-xs outline-none focus:border-[#EC1B23] shadow-inner" value={d.cell} onChange={e => updateDirector(d.id, 'cell', e.target.value)} />
                </div>
                
                <div className="md:col-span-2 mt-4 space-y-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                   <p className="text-[9px] font-black text-[#EC1B23] uppercase tracking-[0.2em]">Member Residential Address</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input placeholder="STREET & NO" className="md:col-span-2 w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white font-bold text-[10px] outline-none focus:border-[#EC1B23]" value={d.address} onChange={e => updateDirector(d.id, 'address', e.target.value)} />
                      <input placeholder="CITY" className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white font-bold text-[10px] outline-none focus:border-[#EC1B23]" value={d.city} onChange={e => updateDirector(d.id, 'city', e.target.value)} />
                      <input placeholder="POST CODE" className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white font-bold text-[10px] outline-none focus:border-[#EC1B23]" value={d.postalCode} onChange={e => updateDirector(d.id, 'postalCode', e.target.value)} />
                      <select className="md:col-span-2 w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-white font-bold text-[10px] outline-none focus:border-[#EC1B23] appearance-none" value={d.province} onChange={e => updateDirector(d.id, 'province', e.target.value)}>
                        {PROVINCES.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                      </select>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 rounded-[3rem] border border-white/10 space-y-8 shadow-2xl">
         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Compliance Awareness Protocol</h4>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="flex items-center gap-5 cursor-pointer group p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-[#EC1B23]/40 transition-all">
              <input type="checkbox" className="w-6 h-6 rounded-lg bg-slate-950 border-white/20 text-[#EC1B23] focus:ring-[#EC1B23] cursor-pointer" onChange={e => setFormData({...formData, uif: e.target.checked ? 'Yes' : 'No'})} />
              <div className="space-y-0.5">
                 <span className="text-xs font-black text-white uppercase tracking-widest block">UIF Registration?</span>
                 <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest block">Labor Compliance Module</span>
              </div>
            </label>
            <label className="flex items-center gap-5 cursor-pointer group p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-[#EC1B23]/40 transition-all">
              <input type="checkbox" className="w-6 h-6 rounded-lg bg-slate-950 border-white/20 text-[#EC1B23] focus:ring-[#EC1B23] cursor-pointer" onChange={e => setFormData({...formData, bank: e.target.checked ? 'Yes' : 'No'})} />
              <div className="space-y-0.5">
                 <span className="text-xs font-black text-white uppercase tracking-widest block">Bank Account?</span>
                 <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest block">Facilitation & Setup</span>
              </div>
            </label>
         </div>
      </div>

      <div className="space-y-6 pt-4">
        <button 
          type="submit"
          className="w-full py-8 bg-gradient-to-r from-[#EC1B23] to-[#770E13] text-white font-black rounded-[2.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-red-500/40 uppercase tracking-[0.2em] text-sm relative overflow-hidden group"
        >
          <span className="relative z-10">{isExisting ? 'Sync Business Data' : 'Submit Registration • R495'}</span>
          <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
        </button>
        <div className="flex items-center justify-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
           Secured via Marvetti Cloud
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
      </div>
    </form>
  );
};
