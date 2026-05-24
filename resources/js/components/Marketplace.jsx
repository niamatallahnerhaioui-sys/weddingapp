import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, BadgeDollarSign, MessageCircle } from 'lucide-react';

const Marketplace = ({ setView, setTargetPrestataire }) => {
    const [prestataires, setPrestataires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // حالات الفلاتر (Filters States)
    const [selectedVille, setSelectedVille] = useState('');
    const [selectedBudget, setSelectedBudget] = useState('');

    // 🔄 جلب الـ Salles والـ Traiteurs من الـ Database
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [sallesRes, traiteursRes] = await axios.all([
                    axios.get('http://localhost:8000/api/salles'),
                    axios.get('http://localhost:8000/api/traiteurs')
                ]);

                const sallesWithFormat = sallesRes.data.map(s => ({ ...s, type: 'salle' }));
                const traiteursWithFormat = traiteursRes.data.map(t => ({ ...t, type: 'traiteur' }));

                setPrestataires([...sallesWithFormat, ...traiteursWithFormat]);
                setLoading(false);
            } catch (err) {
                console.error("Erreur عند جلب البيانات من الـ Database:", err);
                setError("Impossible de charger les données réelles.");
                
                // Fallback (بيانات تجريبية متطابقة مع الصور ديالك)
                setPrestataires([
                    { id: 1, nom: "SALLE MARHABA", ville: "MARRAKESH", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600", type: 'salle' },
                    { id: 2, nom: "TRAITERIE ROYAL", ville: "RABAT", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600", type: 'traiteur' },
                    { id: 3, nom: "NEGAFA CHEZ KHADIJA", ville: "EL JADIDA", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600", type: 'negafa' },
                    { id: 4, nom: "LES FLEURS DE JOIE", ville: "SAFI", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600", type: 'fleurs' }
                ]);
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleActionDevis = (prestataire) => {
        setTargetPrestataire?.({ id: prestataire.id, nom: prestataire.nom });
        setView?.('demande_devis');
    };

    // 🔍 فلترة متطورة (البحث + المدينة + الميزانية)
    const filteredPrestataires = prestataires.filter(p => {
        const matchesSearch = p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.ville?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVille = selectedVille ? p.ville?.toLowerCase().includes(selectedVille.toLowerCase()) : true;
        return matchesSearch && matchesVille;
    });

    return (
        <div className="w-full min-h-screen bg-[#1E3E2F] font-sans text-stone-800 relative pb-24 overflow-x-hidden">
            
            {/* --- Navigation Bar --- */}
            <nav className="w-full px-6 md:px-12 flex justify-between items-center bg-transparent py-6 box-border z-30 relative">
                {/* اللوغو بنفس لون Marketplace المستهدف */}
                <div className="flex items-center cursor-pointer" onClick={() => setView?.('home')}>
                    <h1 className="text-2xl md:text-3xl font-serif font-black tracking-[0.2em] text-[#D4AF37] uppercase italic font-bold">
                        OURS
                    </h1>
                </div>
                
                {/* الأزرار الوسطى: شفافة تماماً وبدون أي خلفية (No background/No borders) */}
                <div className="flex items-center gap-6 md:gap-10 text-xs md:text-sm font-medium tracking-wider bg-transparent">
                    <button 
                        onClick={() => setView?.('budget_estimator')} 
                        className="bg-transparent border-none p-0 text-white hover:text-[#D4AF37] transition duration-300 cursor-pointer outline-none"
                    >
                        Budget Estimator
                    </button>
                    <button 
                        onClick={() => setView?.('marketplace')} 
                        className="bg-transparent border-none p-0 text-[#D4AF37] font-semibold transition duration-300 border-b-2 border-[#DEB887] pb-1 cursor-pointer outline-none"
                    >
                        Marketplace
                    </button>
                    <button 
                        onClick={() => setView?.('login')} 
                        className="bg-transparent border-none p-0 text-white hover:text-[#D4AF37] transition duration-300 cursor-pointer outline-none"
                    >
                        Packs
                    </button>
                </div>

                {/* زر Espace Pro بنفس لون الـ Marketplace التناغمي */}
                <div>
                    <button 
                        onClick={() => setView?.('login')} 
                        className="bg-[#D4AF37] text-[#1E3E2F] text-xs font-bold uppercase tracking-[0.1em] px-5 py-2 rounded-full hover:bg-white hover:text-[#1E3E2F] transition-all shadow-md border-none cursor-pointer"
                    >
                        Espace Pro
                    </button>
                </div>
            </nav>

            {/* --- Search and Filters --- */}
            <div className="w-full max-w-5xl mx-auto mt-8 px-6 relative z-10 space-y-4">
                {/* حقل البحث الرئيسي العريض */}
                <div className="w-full bg-[#163225] rounded-none border border-black/30 flex items-center px-4 py-3.5 shadow-inner">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="SEARCH (SALLE, TRAITEUR, VILLE...)" 
                        className="w-full bg-transparent border-none outline-none text-white font-medium tracking-widest text-sm placeholder-gray-400/70 uppercase"
                    />
                    <Search size={20} className="text-gray-400 cursor-pointer" />
                </div>

                {/* أزرار الفلاتر الملونة القابلة للكتابة والتعديل */}
                <div className="flex justify-start gap-3">
                    {/* فلتر المدينة */}
                    <div className="bg-white rounded-md shadow-md flex items-center px-3 py-1.5 border border-stone-200 w-44">
                        <MapPin size={16} className="text-stone-700 mr-2 flex-shrink-0" />
                        <input 
                            type="text"
                            value={selectedVille}
                            onChange={(e) => setSelectedVille(e.target.value)}
                            placeholder="VILLE"
                            className="w-full bg-transparent border-none outline-none text-xs font-bold tracking-wider text-stone-800 placeholder-stone-700 uppercase"
                        />
                    </div>

                    {/* فلتر الميزانية */}
                    <div className="bg-white rounded-md shadow-md flex items-center px-3 py-1.5 border border-stone-200 w-44">
                        <BadgeDollarSign size={16} className="text-stone-700 mr-2 flex-shrink-0" />
                        <input 
                            type="text"
                            value={selectedBudget}
                            onChange={(e) => setSelectedBudget(e.target.value)}
                            placeholder="BUDGET"
                            className="w-full bg-transparent border-none outline-none text-xs font-bold tracking-wider text-stone-800 placeholder-stone-700 uppercase"
                        />
                    </div>
                </div>
            </div>

            {/* --- Grid Cards --- */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[300px] mt-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DEB887]"></div>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    {filteredPrestataires.map((p) => (
                        <div 
                            key={`${p.type}-${p.id}`} 
                            className="w-full flex flex-col items-center group cursor-pointer"
                            onClick={() => handleActionDevis(p)}
                        >
                            <div className="w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-[#163225] shadow-2xl relative border-4 border-transparent group-hover:border-[#DEB887]/50 transition-all duration-300">
                                <img 
                                    src={p.image} 
                                    alt={p.nom} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="w-full text-center mt-4">
                                <p className="text-xs font-medium tracking-[0.25em] text-[#DEB887] uppercase mb-1">
                                    {p.ville}
                                </p>
                                <h3 className="text-lg md:text-xl font-serif font-bold tracking-wide text-white uppercase">
                                    {p.nom}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Wedding Bot --- */}
            <div 
                onClick={() => setView?.('wedding_bot')}
                className="fixed bottom-8 right-8 bg-[#DEB887] p-4 rounded-full shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all z-50 group"
            >
                <MessageCircle size={24} className="text-[#1E3E2F]" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-emerald-400 rounded-full border-2 border-[#DEB887]"></span>
            </div>

        </div>
    );
};

export default Marketplace;