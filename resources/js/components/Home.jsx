import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, Star, CheckCircle, ShieldCheck, Heart } from 'lucide-react';
import heroImage from '../assets/hero-bg.jpg';
import BudgetEstimator from './BudgetEstimator';

const Home = ({ onStart }) => {
    const [ville, setVille] = useState('');
    const villesMaroc = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir", "Fès", "Safi"];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            
            {/* --- Hero Section --- */}
            <section 
                className="relative min-h-[800px] flex items-center justify-center bg-cover bg-center py-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})`
                }}
            >
                <div className="text-center text-white px-4 max-w-6xl z-10 flex flex-col items-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif font-bold mb-8 italic leading-tight"
                    >
                        Elite Wedding Maroc
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl mb-16 font-light tracking-widest max-w-3xl"
                    >
                        L'élégance et l'excellence pour votre grand jour
                    </motion.p>

                    {/* Search Bar: تم تصحيح التقسيم لضمان عدم التداخل */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-6 md:p-8 w-full max-w-5xl border border-white/20 mx-auto"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                            
                            <div className="flex flex-col gap-2 text-left">
                                <label className="text-[10px] font-black text-[#047857] uppercase tracking-widest ml-4">Localisation</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                                    <select
                                        value={ville}
                                        onChange={(e) => setVille(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-700 focus:ring-2 focus:ring-[#047857] shadow-inner transition-all appearance-none"
                                    >
                                        <option value="">Ville</option>
                                        {villesMaroc.map((v) => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 text-left">
                                <label className="text-[10px] font-black text-[#047857] uppercase tracking-widest ml-4">Nombre d'invités</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-700 focus:ring-2 focus:ring-[#047857] shadow-inner transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 text-left">
                                <label className="text-[10px] font-black text-[#047857] uppercase tracking-widest ml-4">Budget Max</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] font-bold text-xs">MAD</span>
                                    <input
                                        type="number"
                                        placeholder="100 000"
                                        className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-700 focus:ring-2 focus:ring-[#047857] shadow-inner transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={onStart}
                                className="bg-[#047857] text-white py-4 rounded-2xl hover:bg-[#035e44] hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 font-bold shadow-xl shadow-emerald-900/20 active:scale-95 w-full"
                            >
                                <Search className="w-5 h-5" />
                                <span className="uppercase tracking-widest text-sm">Explorer</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Budget Estimator Section --- */}
            <section className="py-32 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold text-gray-800 italic">Planifiez votre budget</h2>
                        <p className="text-gray-500 mt-3 font-medium">Répartition intelligente basée sur nos packs exclusifs</p>
                        <div className="h-1 w-24 bg-[#D4AF37] mx-auto mt-6 rounded-full"></div>
                    </div>
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-stone-100">
                        <BudgetEstimator />
                    </div>
                </div>
            </section>

            {/* --- Pourquoi Nous Section --- */}
            <section className="bg-emerald-50/50 py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="text-center group">
                            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-[#047857] group-hover:text-white transition-all">
                                <Search size={32} className="text-[#047857] group-hover:text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Recherche Facile</h3>
                            <p className="text-gray-500 text-sm">Filtrez par ville et budget.</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-[#047857] group-hover:text-white transition-all">
                                <ShieldCheck size={32} className="text-[#047857] group-hover:text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Vérifié</h3>
                            <p className="text-gray-500 text-sm">Prestataires certifiés Elite.</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-[#047857] group-hover:text-white transition-all">
                                <Star size={32} className="text-[#D4AF37]" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Packs Exclusifs</h3>
                            <p className="text-gray-500 text-sm">Économisez jusqu'à 30%.</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-[#047857] group-hover:text-white transition-all">
                                <Heart size={32} className="text-rose-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Accompagnement</h3>
                            <p className="text-gray-500 text-sm">Un conseiller IA 24/7.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;