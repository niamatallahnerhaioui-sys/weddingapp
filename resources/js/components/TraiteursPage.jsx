import React, { useState, useEffect } from 'react';
import { MapPin, Star, Heart, ChefHat, Search } from 'lucide-react';

// ملاحظة: البيانات (traiteurs, villesMaroc) خاص يكونو عندك ف ملف mockData
// إلا ما كانوش، قوليها ليا نعطيك بيانات تجريبية
import { traiteurs, villesMaroc } from '../data/mockData';

export function TraiteursPage({ onNavigate }) {
    const [filteredTraiteurs, setFilteredTraiteurs] = useState(traiteurs || []);
    const [ville, setVille] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [favoris, setFavoris] = useState([]);

    useEffect(() => {
        let filtered = traiteurs || [];
        if (ville) filtered = filtered.filter(t => t.ville === ville);
        if (budgetMax) {
            filtered = filtered.filter(t =>
                t.formules.some(f => f.prixParPersonne <= parseInt(budgetMax))
            );
        }
        setFilteredTraiteurs(filtered);
    }, [ville, budgetMax]);

    const toggleFavori = (id) => {
        setFavoris(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Header القسم العلوي */}
            <div className="bg-[#047857] text-white py-16 px-6 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <ChefHat className="w-10 h-10 text-[#D4AF37]" />
                        <h1 className="text-4xl font-serif font-bold italic">Nos Traiteurs d'Excellence</h1>
                    </div>
                    <p className="text-emerald-50 text-lg max-w-2xl mb-10">
                        Découvrez les meilleurs traiteurs du Maroc pour un mariage inoubliable.
                    </p>

                    {/* Filters الفلاتر */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-gray-400 text-xs font-bold uppercase mb-2 ml-1">Ville</label>
                            <select 
                                value={ville}
                                onChange={(e) => setVille(e.target.value)}
                                className="w-full p-3 bg-gray-50 border-none rounded-xl text-gray-700 focus:ring-2 focus:ring-[#047857]"
                            >
                                <option value="">Toutes les villes</option>
                                {villesMaroc?.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-gray-400 text-xs font-bold uppercase mb-2 ml-1">Budget Max (MAD/pers)</label>
                            <input 
                                type="number"
                                placeholder="Ex: 400"
                                value={budgetMax}
                                onChange={(e) => setBudgetMax(e.target.value)}
                                className="w-full p-3 bg-gray-50 border-none rounded-xl text-gray-700 focus:ring-2 focus:ring-[#047857]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid display عرض التريتورات */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTraiteurs.map((traiteur) => (
                        <div key={traiteur.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                            <div className="relative h-64">
                                <img src={traiteur.image} alt={traiteur.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 right-4">
                                    <button 
                                        onClick={() => toggleFavori(traiteur.id)}
                                        className={`p-3 rounded-full backdrop-blur-md transition ${favoris.includes(traiteur.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
                                    >
                                        <Heart size={20} fill={favoris.includes(traiteur.id) ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full flex items-center gap-1">
                                    <Star size={14} className="text-[#D4AF37] fill-current" />
                                    <span className="text-sm font-bold">{traiteur.note}</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-serif font-bold text-gray-800">{traiteur.nom}</h3>
                                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                                        <MapPin size={14} />
                                        <span>{traiteur.ville}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <p className="text-gray-500 text-sm line-clamp-2 italic">"{traiteur.description}"</p>
                                    <div className="flex flex-wrap gap-2">
                                        {traiteur.specialites?.slice(0, 3).map(spec => (
                                            <span key={spec} className="bg-emerald-50 text-[#047857] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t pt-6">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">À partir de</p>
                                        <p className="text-xl font-bold text-[#047857]">{traiteur.formules[0]?.prixParPersonne} <span className="text-xs">MAD/pers</span></p>
                                    </div>
                                    <button 
                                        onClick={() => onNavigate('login')}
                                        className="bg-[#D4AF37] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#b8962e] transition shadow-md"
                                    >
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}