import React from 'react';
import { motion } from 'framer-motion';

// استيراد الصور من مجلد assets
import heroImage from '../assets/hero-bg.jpg'; 
import imageSalles from '../assets/image-salles.jpg'; 
import imageTable from '../assets/image-table.jpg'; 
import imagePhoto from '../assets/image-photo.jpg'; 

const Home = ({ onStart, setView, view }) => {
    return (
        /* حماية الصفحة كاملة من أي خروج أفقي */
        <div className="w-full min-h-screen bg-[#F9F7F2] font-sans text-stone-800 selection:bg-[#D4AF37]/30 overflow-x-hidden">
            
            {/* --- Navigation Bar --- */}
            <nav className="absolute top-0 left-0 w-full z-50 px-6 md:px-12 flex justify-between items-center bg-transparent py-6 box-border">
                
                {/* 1. اللوغو جهة اليسار */}
                <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => setView?.('home')}>
                    <h1 className="text-xl md:text-2xl font-serif font-black tracking-[0.2em] text-[#0A2A22] uppercase italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                        OURS
                    </h1>
                </div>
                
                {/* 2. الروابط في الوسط */}
                <div className="flex items-center gap-6 md:gap-12 lg:gap-16 text-xs md:text-sm font-serif font-semibold italic tracking-[0.15em] uppercase flex-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <button 
                        onClick={() => setView?.('budget_estimator')} 
                        className="bg-transparent border-none p-0 cursor-pointer text-[#0A2A22] hover:text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap"
                    >
                        Budget Estimator
                    </button>
                    <button 
                        onClick={() => setView?.('marketplace')} 
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

                {/* 3. زر Espace Pro جهة اليمين */}
                <div className="flex items-center flex-shrink-0">
                    <button 
                        onClick={() => setView?.('login')} 
                        className="bg-[#D4AF37] text-[#0A2A22] text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] px-4 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-[#bfa032] transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                        Espace Pro
                    </button>
                </div>
            </nav>

            {/* --- 1. Hero Section --- */}
            <section 
                className="relative h-screen w-full flex items-center justify-center bg-cover bg-center mb-40"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.25)), url(${heroImage})`
                }}
            >
                <div className="text-center text-white px-4 z-10 flex flex-col items-center mt-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-4xl md:text-6xl font-serif text-[#0A2A22] mb-12 tracking-wide italic"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        L'ART DE CÉLÉBRER VOTRE UNION
                    </motion.h1>
                    
                    <motion.button 
                        onClick={() => setView?.('register')}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="bg-[#D4AF37] text-[#0A2A22] text-xs font-semibold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-[#bfa032] transition-all shadow-lg active:scale-95"
                    >
                        Découvrir l'expérience Aura
                    </motion.button>
                </div>
            </section>

            {/* --- 2. Editorial Content Section --- */}
            <section className="max-w-6xl mx-auto px-12 py-20 flex flex-col space-y-40">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
                    <div className="md:col-span-5 flex justify-start">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-[320px] h-[320px] bg-stone-200 overflow-hidden shadow-md flex-shrink-0"
                        >
                            <img src={imageSalles} alt="Salles Majestueuses" className="w-full h-full object-cover" />
                        </motion.div>
                    </div>
                    
                    <div className="hidden md:block md:col-span-1"></div>
                    
                    <div className="md:col-span-6 flex flex-col justify-center pt-4 max-w-md">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-4 text-left"
                        >
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">L'Élite des Prestataires</h2>
                            <p className="text-[13px] leading-relaxed tracking-wide text-justify font-light uppercase text-stone-600/90 leading-[1.8em]">
                                Corporate / Nous avons ausgewählt pour vous les prestataires les plus prestigieux du Royaume. Des salles majestueuses aux traiteurs raffinés, chaque detail est validé par nos soins pour garantir l'excellence de votre union.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
                    <div className="md:col-span-6 flex flex-col justify-center pt-4 max-w-md order-2 md:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-4 text-left"
                        >
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Organisation Sur-Mesure</h2>
                            <p className="text-[13px] leading-relaxed tracking-wide text-justify font-light uppercase text-stone-600/90 leading-[1.8em]">
                                Nous avons sélectionné pour vous les prestataires les plus prestigieux du Royaume. Des salles majestueuses aux traiteurs raffinés, chaque détail est validé by nos soins pour garantir l'excellence de votre union.
                            </p>
                        </motion.div>
                    </div>
                    
                    <div className="hidden md:block md:col-span-1 order-2"></div>
                    
                    <div className="md:col-span-5 flex justify-end order-1 md:order-3">
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-[350px] h-[240px] bg-stone-200 overflow-hidden shadow-md flex-shrink-0"
                        >
                            <img src={imageTable} alt="Dîner d'exception" className="w-full h-full object-cover" />
                        </motion.div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
                    <div className="md:col-span-5 flex justify-start">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-[270px] h-[360px] bg-stone-200 overflow-hidden shadow-md flex-shrink-0"
                        >
                            <img src={imagePhoto} alt="Capture de souvenirs" className="w-full h-full object-cover" />
                        </motion.div>
                    </div>
                    
                    <div className="hidden md:block md:col-span-1"></div>
                    
                    <div className="md:col-span-6 flex flex-col justify-center pt-12 max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-left"
                        >
                            <blockquote className="text-base md:text-lg font-serif italic text-[#D4AF37] border-l-2 border-[#D4AF37] pl-4 py-1 block mb-2 font-light leading-[1.6em]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                “L'INTELLIGENCE AU SERVICE DE VOTRE RÊVE”
                            </blockquote>
                            <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase font-medium pl-4">Aura WeddingBot IA</p>
                        </motion.div>
                    </div>
                </div>

            </section>

            {/* الأيقونة العائمة */}
            <div className="fixed bottom-8 right-8 bg-[#D4AF37]/10 p-3 rounded-full border border-[#D4AF37]/30 backdrop-blur-sm shadow-sm z-30">
                <span className="text-[#D4AF37] text-xl">👑</span>
            </div>
        </div>
    );
};

export default Home;