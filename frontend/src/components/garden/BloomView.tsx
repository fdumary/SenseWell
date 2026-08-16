import React from 'react';
import { Droplets, Sparkles } from 'lucide-react';
import { useGarden } from '../../context/GardenContext';

export const BloomView: React.FC = () => {
  const { bloomFactor, dewDrops, gardenHealth, fertilizeGarden } = useGarden();
  const stage = bloomFactor >= 0.8 ? 'Blooming' : bloomFactor >= 0.5 ? 'Growing' : bloomFactor >= 0.25 ? 'Seedling' : 'Resting';
  const plant = bloomFactor >= 0.8 ? 'blooming.png' : bloomFactor >= 0.5 ? 'growing.png' : bloomFactor >= 0.25 ? 'seedling.png' : 'wilted.png';

  return <div className="w-full max-w-md mx-auto space-y-3 animate-in fade-in duration-500 pb-6">
    <section className="overflow-hidden rounded-3xl border-2 border-[#5C442A] bg-[#243322] shadow-lg">
      <div className="relative min-h-[390px] p-5 flex flex-col items-center justify-between">
        <img src="/assets/garden_cottage_bg.jpg" alt="Cozy garden" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative z-10 text-center"><div className="inline-flex items-center gap-2 rounded-full bg-[#FFF8EA]/95 px-4 py-1.5 text-xs font-bold text-[#2A4B32] shadow-sm"><Sparkles className="w-3.5 h-3.5" /> Plant sanctuary</div><h1 className="mt-3 font-pixel text-xl font-bold text-[#FFF8EA]">Your plant is {stage.toLowerCase()}</h1><p className="mt-2 text-xs font-semibold text-[#DDE9D3]">Every break, breath, and water moment helps it thrive.</p></div>
        <img src={`/assets/trimmed/Plant_Life/${plant}`} alt={`${stage} plant`} className="relative z-10 h-48 w-48 object-contain drop-shadow-2xl animate-float-gentle" />
        <div className="relative z-10 w-full rounded-2xl bg-[#1D2A1C]/90 border border-[#486344] p-3.5"><div className="flex items-center justify-between text-xs font-bold text-[#EDE6D6]"><span>Garden health</span><span>{gardenHealth}%</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-[#101A10]"><div className="h-full rounded-full bg-[#86C27D] transition-all duration-700" style={{ width: `${gardenHealth}%` }} /></div></div>
      </div>
    </section>
    <section className="rounded-3xl border-2 border-[#5C4229] bg-[#3E2B18] p-4 shadow-md"><div className="flex items-center justify-between"><div><p className="text-xs font-pixel font-bold text-[#EDE6D6]">Nurture your bloom</p><p className="mt-1 text-[10px] text-[#AFA28C]">{dewDrops} water drops collected</p></div><Droplets className="w-6 h-6 text-[#60A5FA]" /></div><button onClick={fertilizeGarden} className="mt-4 w-full rounded-2xl bg-[#486940] px-4 py-3 text-xs font-pixel font-bold text-white transition-transform hover:scale-[1.01] hover:bg-[#3D5C35]">Water & celebrate this moment</button></section>
  </div>;
};
