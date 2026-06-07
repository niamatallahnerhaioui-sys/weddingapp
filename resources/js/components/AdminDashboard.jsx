import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart3, ShieldCheck, Package, LogOut, PlusCircle, 
    Trash2, Eye, Mail, Phone, XCircle, CheckCircle, MapPin, User, Building
} from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
    const [subView, setSubView] = useState('packs');
    const [stats, setStats] = useState({
        total_users: 0,
        total_prestataires: 0,
        pending_validation: 0,
        active_packs: 0
    });
    const [pendingPrestataires, setPendingPrestataires] = useState([]);
    const [selectedPrestataire, setSelectedPrestataire] = useState(null);
    const [loading, setLoading] = useState(true);

    const [packs, setPacks] = useState([]);
    const [newPack, setNewPack] = useState({
        nom: '',
        description: '',
        reduction_pct: '',
        prix_estime: '',
        type: 'essentiel'
    });

    const fetchData = async () => {
        try {
            const statsRes = await axios.get('/api/admin/stats');
            setStats(statsRes.data);
            const pendingRes = await axios.get('/api/admin/pending-prestataires');
            setPendingPrestataires(pendingRes.data);
            const packsRes = await axios.get('/api/packs');
            setPacks(packsRes.data);
        } catch (err) {
            console.error("Erreur Database", err);
        } finally {
            loading && setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleValidate = async (id) => {
        try {
            await axios.post(`/api/admin/validate-prestataire/${id}`);
            setPendingPrestataires(prev => prev.filter(p => p.id !== id));
            setStats(prev => ({ 
                ...prev, 
                pending_validation: prev.pending_validation - 1, 
                total_prestataires: prev.total_prestataires + 1 
            }));
            setSelectedPrestataire(null);
            alert("Prestataire validé et activé !");
        } catch (err) {
            alert("Erreur lors de la validation");
        }
    };

    const handleCreatePack = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/admin/packs', newPack);
            setPacks([...packs, res.data.pack]);
            setNewPack({ nom: '', description: '', reduction_pct: '', prix_estime: '', type: 'essentiel' });
            setStats(prev => ({ ...prev, active_packs: prev.active_packs + 1 }));
            alert("Pack créé avec succès !");
        } catch (err) {
            alert("Erreur lors de la création");
        }
    };

    const handleDeletePack = async (id) => {
        if (!window.confirm("Supprimer ce pack ?")) return;
        try {
            await axios.delete(`/api/admin/packs/${id}`);
            setPacks(packs.filter(p => p.id !== id));
            setStats(prev => ({ ...prev, active_packs: prev.active_packs - 1 }));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#F9F7F2] overflow-hidden text-left font-sans select-none">
            
{/* Sidebar الجانبي الموحد بنفس ستيل الـ App */}
            <aside className="w-64 bg-[#233D37] text-white flex flex-col h-full flex-shrink-0 z-20 shadow-xl border-r border-[#1E352F]">
                <div>
                    {/* الهيدر العلوي للـ Sidebar */}
                    <div className="h-24 bg-[#1E352F] flex items-center justify-center border-b border-[#2A4840]">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4B97C] italic">OURS</h2>
                    </div>
                    
                    {/* القائمة البرمجية للتنقل */}
                    <nav className="p-0 flex-1">
                        <button
                            onClick={() => setSubView('stats')}
                            className={`w-full p-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all border-b border-[#1E352F]/40 ${
                                subView === 'stats' 
                                ? 'bg-[#D4B97C] text-[#233D37] font-bold shadow-inner' 
                                : 'bg-[#F9F7F2] text-[#233D37] hover:bg-[#EBE7DC]'
                            }`}
                        >
                            <BarChart3 size={16}/> Statistiques
                        </button>

                        <button
                            onClick={() => setSubView('packs')}
                            className={`w-full p-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all border-b border-[#1E352F]/40 ${
                                subView === 'packs' 
                                ? 'bg-[#D4B97C] text-[#233D37] font-bold shadow-inner' 
                                : 'bg-[#F9F7F2] text-[#233D37] hover:bg-[#EBE7DC]'
                            }`}
                        >
                            <Package size={16}/> Packs
                        </button>

                        <button
                            onClick={() => setSubView('validation')}
                            className={`w-full p-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all border-b border-[#1E352F]/40 ${
                                subView === 'validation' 
                                ? 'bg-[#D4B97C] text-[#233D37] font-bold shadow-inner' 
                                : 'bg-[#F9F7F2] text-[#233D37] hover:bg-[#EBE7DC]'
                            }`}
                        >
                            <ShieldCheck size={16}/> Validation
                            {stats.pending_validation > 0 && (
                                <span className="ml-auto bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-sans">
                                    {stats.pending_validation}
                                </span>
                            )}
                        </button>

                        <button 
                            onClick={onLogout} 
                            className="w-full p-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all bg-[#F9F7F2] text-red-700 hover:bg-red-50 border-b border-[#1E352F]/40"
                        >
                            <LogOut size={16}/> Déconnexion
                        </button>
                    </nav>
                </div>
            </aside>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 overflow-y-auto p-12 flex flex-col items-center relative text-left">
                
                <header className="mb-8 w-full max-w-xl text-center">
                    <h1 className="text-xl font-bold tracking-widest text-stone-800 uppercase font-sans">
                        {subView === 'stats' ? 'STATISTIQUES GENERALES' : subView === 'validation' ? 'VALIDATION DES PRESTATAIRES' : 'GESTION DES PACKS'}
                    </h1>
                </header>

                <div className="w-full max-w-md flex-1 relative flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        
                        {/* 1. الإحصائيات */}
                        {subView === 'stats' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="stats" className="space-y-4 w-full">
                                <div className="bg-[#DEC68B] p-6 rounded-[2rem] text-center text-[#233D37] shadow-sm">
                                    <p className="text-xs uppercase tracking-widest font-bold opacity-75">Total Inscrits</p>
                                    <p className="text-3xl font-black mt-1">{stats.total_users} Utilisateurs</p>
                                </div>
                                <div className="bg-[#DEC68B] p-6 rounded-[2rem] text-center text-[#233D37] shadow-sm">
                                    <p className="text-xs uppercase tracking-widest font-bold opacity-75">Prestataires Actifs</p>
                                    <p className="text-3xl font-black mt-1">{stats.total_prestataires}</p>
                                </div>
                                <div className="bg-[#DEC68B] p-6 rounded-[2rem] text-center text-[#233D37] shadow-sm">
                                    <p className="text-xs uppercase tracking-widest font-bold opacity-75">En attente de Validation</p>
                                    <p className="text-3xl font-black mt-1 text-red-800">{stats.pending_validation}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* 2. واجهة التحقق والتفعيل للـ Prestataires */}
                        {subView === 'validation' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="validation" className="space-y-4 w-full">
                                {pendingPrestataires.length === 0 ? (
                                    <div className="bg-white p-12 rounded-[2rem] text-center border border-dashed border-stone-200">
                                        <p className="text-stone-400 italic font-medium">Aucun prestataire en attente.</p>
                                    </div>
                                ) : (
                                    pendingPrestataires.map((p) => (
                                        /* 🟢 ترجيع لون خلفية البطاقة للذهبي وتنسيق النصوص والأزرار باللون الداكن المتناسق */
                                        <div key={p.id} className="bg-[#DEC68B] p-5 rounded-[2rem] shadow-sm border border-stone-300/10 flex items-center justify-between text-stone-900">
                                            <div>
                                                <h4 className="font-black text-black uppercase tracking-wide text-sm">{p.nom_commercial}</h4>
                                                <p className="text-xs text-black/70 font-bold uppercase tracking-wider mt-0.5">{p.type} • {p.ville}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setSelectedPrestataire(p)} className="p-2 bg-white/30 hover:bg-white/50 rounded-xl text-black transition" title="Voir détails">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleValidate(p.id)} className="p-2 bg-emerald-700 hover:bg-emerald-800 rounded-xl text-white transition" title="Valider">
                                                    <ShieldCheck size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {/* 3. واجهة الـ PACKS */}
                        {subView === 'packs' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="packs" className="w-full flex-1 flex flex-col items-center">
                                <div className="bg-[#DEC68B] p-6 rounded-[2rem] shadow-md text-center text-[#233D37] w-full max-w-sm mb-6">
                                    <div className="flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest text-xs mb-5">
                                        <PlusCircle size={14} /> NOUVEAU PACK
                                    </div>
                                    <form onSubmit={handleCreatePack} className="space-y-3.5">
                                        <input placeholder="NOM DU PACK" required className="w-full p-3 bg-white text-gray-800 rounded-none border border-transparent outline-none uppercase text-xs font-semibold placeholder-gray-400" value={newPack.nom} onChange={e => setNewPack({...newPack, nom: e.target.value})} />
                                        <textarea placeholder="DESCRIPTION" required className="w-full p-3 bg-white text-gray-800 rounded-none border border-transparent outline-none uppercase text-xs font-semibold placeholder-gray-400 h-24 resize-none" value={newPack.description} onChange={e => setNewPack({...newPack, description: e.target.value})} />
                                        <select className="w-full p-3 bg-white text-gray-800 rounded-none border border-transparent outline-none uppercase text-xs font-bold appearance-none cursor-pointer" value={newPack.type} onChange={e => setNewPack({...newPack, type: e.target.value})}><option value="essentiel">ESSENTIEL</option><option value="confort">CONFORT</option><option value="premium">PREMIUM</option></select>
                                        <input type="number" placeholder="PRIX ESTIME" required className="w-full p-3 bg-white text-gray-800 rounded-none border border-transparent outline-none uppercase text-xs font-semibold placeholder-gray-400" value={newPack.prix_estime} onChange={e => setNewPack({...newPack, prix_estime: e.target.value})} />
                                        <input type="number" placeholder="REDUCTION %" required className="w-full p-3 bg-white text-gray-800 rounded-none border border-transparent outline-none uppercase text-xs font-semibold placeholder-gray-400" value={newPack.reduction_pct} onChange={e => setNewPack({...newPack, reduction_pct: e.target.value})} />
                                        <div className="flex justify-center pt-2"><button type="submit" className="bg-white text-black font-bold text-xs uppercase tracking-widest py-2.5 px-8 rounded-full shadow hover:bg-gray-50 transition flex items-center gap-2"><span className="text-base font-light">+</span> AJOUTER</button></div>
                                    </form>
                                </div>

                                <div className="text-center flex-1 w-full flex flex-col items-center">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-700 mb-4">PACKS AJOUTEES</h3>
                                    <div className="flex-1 w-full max-w-sm space-y-2.5 overflow-y-auto pr-2">
                                        {packs.length === 0 ? (
                                            <div className="bg-white p-8 rounded-[1.5rem] text-center border border-dashed border-stone-200">
                                                <p className="text-xs text-gray-400 italic">Aucun pack disponible.</p>
                                            </div>
                                        ) : (
                                            packs.map(pack => (
                                                <div key={pack.id} className="bg-[#DEC68B] px-5 py-3 rounded-xl shadow-sm border border-stone-300/10 flex justify-between items-center text-center text-stone-900">
                                                    <div className="flex-1 flex flex-col items-center text-center space-y-0.5">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/90">PACKS CHEZ NOUS</p>
                                                        <p className="text-[10px] font-medium uppercase tracking-wider text-black/80">{pack.type}</p>
                                                        <p className="text-[11px] font-black tracking-tight text-black">{pack.nom}</p>
                                                        <p className="text-[10px] font-semibold text-black/70">{pack.prix_estime} DH — <span className="text-[#047857] font-bold">-{pack.reduction_pct}%</span></p>
                                                    </div>
                                                    <button onClick={() => handleDeletePack(pack.id)} className="text-red-500 hover:text-red-700 transition p-1.5 hover:bg-white/10 rounded-full" title="Supprimer ce pack">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* الـ Modal الخاص بالـ Prestataire (كبير ومعتم بالكامل) */}
                <AnimatePresence>
                    {selectedPrestataire && (
                        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.96 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.96 }} 
                                className="bg-white opacity-100 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-stone-200"
                            >
                                <div className="bg-[#425B54] p-7 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Building size={24} className="text-[#DEC68B]" />
                                        <div>
                                            <h3 className="text-xl font-extrabold tracking-wide uppercase">{selectedPrestataire.nom_commercial}</h3>
                                            <p className="text-[11px] text-gray-300 uppercase tracking-widest font-semibold mt-0.5">{selectedPrestataire.type}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedPrestataire(null)} className="text-white hover:text-red-400 transition">
                                        <XCircle size={26}/>
                                    </button>
                                </div>

                                <div className="p-8 space-y-6 text-sm text-gray-800 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-stone-50 p-4 rounded-xl space-y-1">
                                            <span className="text-gray-400 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold">
                                                <User size={12} /> Responsable
                                            </span> 
                                            <p className="font-bold text-stone-900 text-base">{selectedPrestataire.user?.prenom} {selectedPrestataire.user?.nom}</p>
                                        </div>

                                        <div className="bg-stone-50 p-4 rounded-xl space-y-1">
                                            <span className="text-gray-400 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold">
                                                <MapPin size={12} /> Ville & Adresse
                                            </span> 
                                            <p className="font-bold text-stone-900 text-base">{selectedPrestataire.ville}</p>
                                        </div>

                                        <div className="bg-stone-50 p-4 rounded-xl space-y-1">
                                            <span className="text-gray-400 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold">
                                                <Mail size={12} /> Email de Contact
                                            </span> 
                                            <p className="font-bold text-stone-900 text-sm break-all">{selectedPrestataire.user?.email}</p>
                                        </div>

                                        <div className="bg-stone-50 p-4 rounded-xl space-y-1">
                                            <span className="text-gray-400 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold">
                                                <Phone size={12} /> Téléphone
                                            </span> 
                                            <p className="font-bold text-stone-900 text-base">{selectedPrestataire.telephone}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            onClick={() => handleValidate(selectedPrestataire.id)} 
                                            className="w-full py-4 bg-emerald-700 text-white font-bold rounded-xl uppercase tracking-widest text-sm hover:bg-emerald-800 shadow-md transition flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18}/> Confirmer la validation du prestataire
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}