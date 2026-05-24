import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const BudgetEstimator = ({ setView }) => {
    const [nbInvites, setNbInvites] = useState('');
    const [budgetTotal, setBudgetTotal] = useState('');
    const [estimation, setEstimation] = useState(null);

    const calculateEstimation = () => {
        const budget = parseInt(budgetTotal) || 0;
        if (budget === 0) return;

        setEstimation({
            salle: Math.round(budget * 0.25),
            traiteur: Math.round(budget * 0.40),
            photo: Math.round(budget * 0.15),
            deco: Math.round(budget * 0.10),
            dj: Math.round(budget * 0.10)
        });
    };

    return (
        <div className="w-full min-h-screen bg-[#F9F7F2] font-sans text-stone-800 flex flex-col overflow-x-hidden">
            
            {/* --- Navigation Bar (تم إصلاح التموضع هنا ليصبح مرناً وبدون تداخل) --- */}
            <nav className="w-full z-50 px-6 md:px-12 flex justify-between items-center bg-transparent py-6 box-border flex-shrink-0">
                {/* اللوغو كيرجعنا للصفحة الرئيسية */}
                <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => setView?.('home')}>
                    <h1 className="text-xl md:text-2xl font-serif font-black tracking-[0.2em] text-[#0A2A22] uppercase italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                        OURS
                    </h1>
                </div>
                
                <div className="flex items-center gap-6 md:gap-12 lg:gap-16 text-xs md:text-sm font-serif font-semibold italic tracking-[0.15em] uppercase flex-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <button 
                        onClick={() => setView?.('budget_estimator')} 
                        className="bg-transparent border-none p-0 cursor-pointer text-[#D4AF37] hover:text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap"
                    >
                        Budget Estimator
                    </button>
                    <button 
                        onClick={() => setView?.('traiteurs')} 
                        className="bg-transparent border-none p-0 cursor-pointer text-[#0A2A22] hover:text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap"
                    >
                        Marketplace
                    </button>
                    <button 
                        onClick={() => setView?.('login')} 
                        className="bg-transparent border-none p-0 cursor-pointer text-[#0A2A22] hover:text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap"
                    >
                        Packs
                    </button>
                </div>

                <div className="flex items-center flex-shrink-0">
                    <button 
                        onClick={() => setView?.('login')} 
                        className="bg-[#D4AF37] text-[#0A2A22] text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] px-4 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-[#bfa032] transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                        Espace Pro
                    </button>
                </div>
            </nav>

            {/* --- Estimator Card Box (تم ضبط المسافات العلوية والهوامش بدقة لجمالية التصميم) --- */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-[#0A2A22]/5 max-w-3xl w-full mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold italic text-[#0A2A22] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Estimez Votre Budget Wedding
                        </h2>
                        <p className="text-xs tracking-widest text-stone-400 uppercase font-medium">Aura Smart Simulator</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        <div className="sm:col-span-2">
                            <input 
                                type="number" 
                                value={budgetTotal} 
                                onChange={(e) => setBudgetTotal(e.target.value)} 
                                placeholder="Votre budget total (MAD)" 
                                className="w-full p-4 h-[56px] bg-stone-50 rounded-2xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#0A2A22] focus:ring-1 focus:ring-[#0A2A22] transition-all" 
                            />
                        </div>
                        <button 
                            onClick={calculateEstimation} 
                            className="w-full h-[56px] bg-[#0A2A22] text-[#E1C482] rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#133f34] transition-all shadow-md active:scale-95"
                        >
                            <Calculator size={16} /> Estimer
                        </button>
                    </div>

                    {estimation && (
                        <div className="space-y-6 pt-6 border-t border-stone-100">
                            {Object.entries({
                                "Lieu & Salle (25%)": {val: estimation.salle, color: "bg-[#0A2A22]"},
                                "Traiteur d'exception (40%)": {val: estimation.traiteur, color: "bg-[#D4AF37]"},
                                "Photo & Vidéo (15%)": {val: estimation.photo, color: "bg-emerald-600"},
                                "Décoration Floral (10%)": {val: estimation.deco, color: "bg-stone-400"},
                                "Animation & DJ (10%)": {val: estimation.dj, color: "bg-stone-700"}
                            }).map(([label, data], i) => (
                                <div key={i} className="space-y-2 text-left">
                                    <div className="flex justify-between text-xs md:text-sm font-medium">
                                        <span className="text-stone-600 font-serif italic">{label}</span>
                                        <span className="font-bold text-[#0A2A22]">{data.val.toLocaleString()} MAD</span>
                                    </div>
                                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${data.color} transition-all duration-500`} 
                                            style={{ width: label.match(/\d+/)[0] + '%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default BudgetEstimator;