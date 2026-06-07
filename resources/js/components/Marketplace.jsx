import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, BadgeDollarSign, MessageCircle } from 'lucide-react';

// 📸 استيراد الصورة الخاصة بالـ Traiteurs من الـ Assets
import defaultTraiteurImage from '../assets/traiteurs.jpg'; 

const Marketplace = ({ setView, setTargetPrestataire }) => {
    const [prestataires, setPrestataires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // حالات الفلاتر (Filters States)
    const [selectedVille, setSelectedVille] = useState('');
    const [selectedBudget, setSelectedBudget] = useState('');

    // 🔄 جلب البيانات الحقيقية من الداتابيز عبر الرابط العمومي الجديد
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // عيطنا للرابط العمومي الموحد لتفادي ERR_CONNECTION_REFUSED و أخطاء الـ Token
                const response = await axios.get('http://localhost:8000/api/public/prestataires');
                
                console.log("Data loaded from DB:", response.data);

                // تحويل وتنسيق البيانات القادمة من الـ Database الحقيقية ديالك
                const formattedData = (response.data || []).map(p => ({ 
                    id: p.id, 
                    nom: p.nom || "Sans nom", 
                    ville: p.ville || "Casablanca", 
                    type: p.type, // 'salle' أو 'traiteur' قادمة مباشرة من الـ DB
                    prix: p.prix || p.prix_estime || 0,
                    displayImage: p.type === 'salle' 
                        ? (p.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600")
                        : defaultTraiteurImage // الـ traiteur ياخذ الصورة الافتراضية من الـ assets
                }));

                setPrestataires(formattedData);
                setLoading(false);
            } catch (err) {
                console.error("Erreur عند جلب البيانات من الـ Database:", err);
                // حيدنا الـ Fallback القديم باش ميبقاش يظهر "Marhaba" و "Royal" الوهميين
                setError("Impossible de charger les données réelles depuis le serveur.");
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleActionDevis = (prestataire) => {
        const token = localStorage.getItem('token'); 
        
        if (!token) {
            alert("Veuillez vous connecter d'abord pour pouvoir demander un devis.");
            setView?.('login'); 
            return;
        }

        setTargetPrestataire?.({ id: prestataire.id, nom: prestataire.nom });
        setView?.('demande_devis');
    };

    // 🔍 الفلترة بناءً على بيانات الداتابيز الحقيقية (Casablanca، salle al andalous...)
    const filteredPrestataires = prestataires.filter(p => {
        const matchesSearch = (p.nom?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (p.ville?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesVille = selectedVille ? p.ville?.toLowerCase().includes(selectedVille.toLowerCase()) : true;
        
        const itemPrice = p.prix || 0;
        const matchesBudget = selectedBudget ? itemPrice <= parseFloat(selectedBudget) : true;

        return matchesSearch && matchesVille && matchesBudget;
    });

    return (
        <div className="w-full min-h-screen bg-[#1E3E2F] font-sans text-stone-800 relative pb-24 overflow-x-hidden">
            
            {/* --- Navigation Bar --- */}
            <nav className="w-full px-6 md:px-12 flex justify-between items-center bg-transparent py-6 box-border z-30 relative">
                <div className="flex items-center cursor-pointer" onClick={() => setView?.('home')}>
                    <h1 className="text-2xl md:text-3xl font-serif font-black tracking-[0.2em] text-[#DEB887] uppercase italic">
                        OURS
                    </h1>
                </div>
                
                <div className="flex items-center gap-6 md:gap-10 text-xs md:text-sm font-medium tracking-wider bg-transparent">
                    <button onClick={() => setView?.('budget_estimator')} className="bg-transparent border-none p-0 text-white hover:text-[#DEB887] transition duration-300 cursor-pointer outline-none">
                        Budget Estimator
                    </button>
                    <button onClick={() => setView?.('marketplace')} className="bg-transparent border-none p-0 text-[#DEB887] font-semibold transition duration-300 border-b-2 border-[#DEB887] pb-1 cursor-pointer outline-none">
                        Marketplace
                    </button>
                    <button onClick={() => setView?.('packs')} className="bg-transparent border-none p-0 text-white hover:text-[#DEB887] transition duration-300 cursor-pointer outline-none">
                        Packs
                    </button>
                </div>

                <div>
                    <button onClick={() => setView?.('login')} className="bg-[#DEB887] text-[#1E3E2F] text-xs font-bold uppercase tracking-[0.1em] px-5 py-2 rounded-full hover:bg-white hover:text-[#1E3E2F] transition-all shadow-md border-none cursor-pointer">
                        Espace Pro
                    </button>
                </div>
            </nav>

            {/* --- Search and Filters --- */}
            <div className="w-full max-w-5xl mx-auto mt-8 px-6 relative z-10 space-y-4">
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

                <div className="flex justify-start gap-3">
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

                    <div className="bg-white rounded-md shadow-md flex items-center px-3 py-1.5 border border-stone-200 w-44">
                        <BadgeDollarSign size={16} className="text-stone-700 mr-2 flex-shrink-0" />
                        <input 
                            type="number"
                            value={selectedBudget}
                            onChange={(e) => setSelectedBudget(e.target.value)}
                            placeholder="BUDGET MAX"
                            className="w-full bg-transparent border-none outline-none text-xs font-bold tracking-wider text-stone-800 placeholder-stone-700 uppercase"
                        />
                    </div>
                </div>
            </div>

            {/* --- Grid Cards --- */}
            <div className="max-w-5xl mx-auto px-6 mt-10 relative z-10">
                {error && (
                    <div className="w-full text-center p-4 bg-red-950/40 border border-red-500/50 text-red-200 rounded-xl text-xs font-mono mb-6">
                        {error}
                        <p className="mt-1 text-stone-400">💡 تأكد من تشغيل سيرفر لارافيل عبر الأمر: php artisan serve</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DEB887]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {filteredPrestataires.length === 0 ? (
                            <div className="col-span-full text-center text-white/60 py-10 italic">
                                Aucun prestataire trouvé.
                            </div>
                        ) : (
                            filteredPrestataires.map((p) => (
                                <div 
                                    key={`${p.type}-${p.id}`} 
                                    className="w-full flex flex-col items-center group cursor-pointer"
                                    onClick={() => handleActionDevis(p)}
                                >
                                    <div className="w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-[#163225] shadow-2xl relative border-4 border-transparent group-hover:border-[#DEB887]/50 transition-all duration-300">
                                        <img 
                                            src={p.displayImage}  
                                            alt={p.nom} 
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className="absolute top-4 left-4 bg-[#163225]/80 text-[#DEB887] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                                            {p.type}
                                        </span>
                                    </div>

                                    <div className="w-full text-center mt-4">
                                        <p className="text-xs font-medium tracking-[0.25em] text-[#DEB887] uppercase mb-1">
                                            {p.ville}
                                        </p>
                                        <h3 className="text-lg md:text-xl font-serif font-bold tracking-wide text-white uppercase">
                                            {p.nom}
                                        </h3>
                                        {p.prix > 0 && (
                                            <p className="text-sm text-stone-400 mt-1 font-mono">
                                                {p.prix} DH
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

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