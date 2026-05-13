import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const BudgetEstimator = () => {
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
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-100 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <input type="number" value={budgetTotal} onChange={(e) => setBudgetTotal(e.target.value)} placeholder="Votre budget total (MAD)" className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#047857]" />
                <button onClick={calculateEstimation} className="bg-[#047857] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#035e44] transition-all">
                    <Calculator size={20} /> Estimer
                </button>
            </div>

            {estimation && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    {Object.entries({
                        "Lieu (25%)": {val: estimation.salle, color: "bg-emerald-600"},
                        "Traiteur (40%)": {val: estimation.traiteur, color: "bg-[#D4AF37]"},
                        "Photo/Vidéo (15%)": {val: estimation.photo, color: "bg-emerald-400"},
                        "Déco (10%)": {val: estimation.deco, color: "bg-gray-400"},
                        "DJ (10%)": {val: estimation.dj, color: "bg-emerald-900"}
                    }).map(([label, data], i) => (
                        <div key={i} className="space-y-1 text-left">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-600">{label}</span>
                                <span className="font-bold text-[#047857]">{data.val.toLocaleString()} MAD</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full ${data.color}`} style={{ width: label.match(/\d+/)[0] + '%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BudgetEstimator;