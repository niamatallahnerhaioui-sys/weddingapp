import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Sparkles } from 'lucide-react';

export default function PacksPage({ setView }) {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('https://wedapp.test/api/packs')
            .then(response => {
                setPacks(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur lors du chargement des packs:", err);
                setError("Impossible de charger les packs pour le moment.");
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between relative font-serif select-none pb-12">
            
            {/* الـ Navbar مع الخط الفاصل الخفيف */}
            <nav className="w-full flex flex-row justify-between items-center bg-transparent px-12 py-6 box-border z-50 border-b border-stone-200/50">
                {/* 1. اللوغو */}
                <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => setView?.('home')}>
                    <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] text-[#0A2A22] uppercase italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                        OURS
                    </h1>
                </div>

                {/* 2. الروابط مرتبة أفقياً */}
                <div className="flex flex-row items-center gap-8 md:gap-12 lg:gap-16 text-xs md:text-sm font-semibold italic tracking-[0.15em] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <button onClick={() => setView?.('budget_estimator')} className="bg-transparent border-none p-0 cursor-pointer text-[#0A2A22] hover:text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap">
                        Budget Estimator
                    </button>
                    <button onClick={() => setView?.('marketplace')} className="bg-transparent border-none p-0 cursor-pointer text-[#0A2A22] hover:text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap">
                        Marketplace
                    </button>
                    <button onClick={() => setView?.('packs')} className="bg-transparent border-none p-0 cursor-pointer text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap">
                        Packs
                    </button>
                </div>

                {/* 3. زر Espace Pro */}
                <div className="flex items-center flex-shrink-0">
                    <button onClick={() => setView?.('login')} className="bg-[#D4AF37] text-[#0A2A22] text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full hover:bg-[#bfa032] transition-all shadow-md active:scale-95 whitespace-nowrap">
                        Espace Pro
                    </button>
                </div>
            </nav>

            {/* المحتوى الرئيسي */}
            <div className="w-full max-w-7xl mx-auto px-12 mt-16 mb-16 flex-1 flex flex-col items-center">
                
                {/* العنوان الرئيسي للباج */}
                <h1 className="text-3xl md:text-4xl font-light italic tracking-[0.2em] text-stone-800 uppercase text-center mb-16" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Our Packs
                </h1>

                {/* حالة التحميل والخطأ */}
                {loading && (
                    <div className="flex flex-col items-center justify-center my-20 text-stone-400 gap-3">
                        <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
                        <span className="text-xs uppercase tracking-widest font-sans">Chargement...</span>
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 max-w-md my-10 text-sm font-sans">
                        {error}
                    </div>
                )}

                {/* --- الحل هنا: استخدام Flexbox أفقي حقيقي عوض الـ Grid لضمان اليمين واليسار --- */}
                {!loading && !error && (
                    <div className="flex flex-col md:flex-row flex-wrap justify-between items-stretch gap-8 w-full">
                        {packs.map((pack, index) => (
                            <div 
                                key={pack.id || index}
                                /* الـ w-[48%] كتضمن يجيو جوج ف السطر متفارقين، وحيدنا الـ aspect ratio وبدلناه بـ min-h-[280px] باش يبانو كاع المعلومات */
                                className="bg-[#BC9414] text-[#0A2A22] rounded-[2rem] p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden w-full md:w-[48%] min-h-[260px] box-border"
                            >
                                {/* نسبة الخصم تظهر في زاوية الكارت (-20% / -30%) بشكل واضح */}
                                {pack.reduction && (
                                    <div className="absolute top-6 right-6 bg-[#0A2A22] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full shadow-sm font-sans z-10">
                                        {pack.reduction.toString().includes('%') ? pack.reduction : `-${pack.reduction}%`}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* نوع الباقة (Type) والإسم */}
                                    <div>
                                        {pack.type && (
                                            <span className="text-[11px] uppercase tracking-widest font-black text-[#0A2A22]/60 font-sans block mb-1">
                                                {pack.type}
                                            </span>
                                        )}
                                        <h3 className="text-xl md:text-2xl font-bold tracking-wide capitalize font-sans pr-16">
                                            {pack.nom || 'Our Pack'}
                                        </h3>
                                    </div>
                                    
                                    {/* الوصف (الخدمات كاملين باينين بلا متقطعهم الكارت) */}
                                    <p className="text-xs md:text-sm text-[#0A2A22]/90 font-sans leading-relaxed">
                                        {pack.description || 'Description du pack...'}
                                    </p>
                                </div>

                                {/* الجزء السفلي للسعر والتعريفة */}
                                <div className="border-t border-[#0A2A22]/20 pt-4 mt-6 flex justify-between items-baseline">
                                    <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#0A2A22]/70">Tarif Unique</span>
                                    <span className="text-xl md:text-2xl font-black font-sans tracking-tight text-[#0A2A22]">
                                        {pack.prix_estime ? `${pack.prix_estime} DH` : 'Contact'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* خط الديكور الأسفل */}
            <div className="w-full h-3 bg-[#D4AF37] mt-auto"></div>
        </div>
    );
}