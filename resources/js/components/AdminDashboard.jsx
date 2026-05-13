import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, CheckCircle, PlusCircle, Users, 
    LogOut, Bell, Package, BarChart3, ShieldCheck,
    ChefHat, LayoutDashboard, Utensils, Eye, XCircle, Mail, Phone, MapPin, Trash2
} from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
    const [subView, setSubView] = useState('stats');
    const [stats, setStats] = useState({
        total_users: 0,
        total_prestataires: 0,
        pending_validation: 0,
        active_packs: 0
    });
    const [pendingPrestataires, setPendingPrestataires] = useState([]);
    const [selectedPrestataire, setSelectedPrestataire] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- State خاص بالـ Packs ---
    const [packs, setPacks] = useState([]);
    const [newPack, setNewPack] = useState({
        nom: '',
        description: '',
        reduction_pct: 0,
        prix_estime: '',
        type: 'essentiel'
    });

    const fetchData = async () => {
        try {
           const statsRes = await axios.get('/api/admin/stats');
            setStats(statsRes.data);
            const pendingRes = await axios.get('/api/admin/pending-prestataires');
            setPendingPrestataires(pendingRes.data);
            // جلب الـ Packs
            const packsRes = await axios.get('/api/packs');
            setPacks(packsRes.data);
        } catch (err) {
            console.error("Erreur Database", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleValidate = async (id) => {
        try {
            await axios.post(`/api/admin/validate-prestataire/${id}`);
            setPendingPrestataires(prev => prev.filter(p => p.id !== id));
            setStats(prev => ({ ...prev, pending_validation: prev.pending_validation - 1, total_prestataires: prev.total_prestataires + 1 }));
            setSelectedPrestataire(null);
            alert("Prestataire validé et activé !");
        } catch (err) {
            alert("Erreur lors de la validation");
        }
    };

    // --- وظائف الـ Packs ---
   const handleCreatePack = async (e) => {
    e.preventDefault();
    try {
        // استعملي الرابط الكامل اللي خدم ليك في المتصفح
       const res = await axios.post('/api/admin/packs', newPack);
        
        setPacks([...packs, res.data.pack]);
        setNewPack({ nom: '', description: '', reduction_pct: 0, prix_estime: '', type: 'essentiel' });
        setStats(prev => ({ ...prev, active_packs: prev.active_packs + 1 }));
        alert("Pack créé avec succès !");
    } catch (err) {
        console.error("Détails de l'erreur:", err.response?.data);
        alert("Erreur lors de la création: " + (err.response?.data?.message || "Vérifiez la console"));
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
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-left font-sans">
            
            <aside className="w-72 bg-stone-900 text-white p-8 flex flex-col shadow-2xl flex-shrink-0 z-50">
                <div className="mb-12 cursor-pointer" onClick={() => window.location.href='/'}>
                    <h2 className="text-2xl font-serif font-bold text-[#D4AF37] italic tracking-tight">Elite Admin</h2>
                    <div className="h-1 w-12 bg-[#D4AF37] mt-2 rounded-full"></div>
                </div>

                <nav className="space-y-4 flex-1 font-bold">
                    {[
                        { id: 'stats', label: 'Statistiques', icon: <BarChart3 size={20}/> },
                        { id: 'validation', label: 'Validations', icon: <ShieldCheck size={20}/> },
                        { id: 'packs', label: 'Gestion Packs', icon: <Package size={20}/> },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSubView(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                                subView === item.id ? 'bg-[#D4AF37] text-stone-900 shadow-lg' : 'text-stone-400 hover:bg-white/5'
                            }`}
                        >
                            {item.icon} {item.label}
                            {item.id === 'validation' && stats.pending_validation > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse">{stats.pending_validation}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <button onClick={onLogout} className="flex items-center gap-3 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold border-t border-white/10 pt-6"><LogOut size={20}/> Déconnexion</button>
            </aside>

            <main className="flex-1 overflow-y-auto p-12 relative text-left">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-stone-800 italic uppercase tracking-tight">
                        {subView === 'stats' ? 'Tableau de Bord' : subView === 'validation' ? 'Vérification' : 'Gestion des Packs'}
                    </h1>
                </header>

                <AnimatePresence mode="wait">
                    {subView === 'stats' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key="stats">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-left">
                                <StatCard label="Total Inscrits" val={stats.total_users} icon={<Users/>} col="text-blue-600" bg="bg-blue-50" />
                                <StatCard label="Prestataires" val={stats.total_prestataires} icon={<ChefHat/>} col="text-emerald-600" bg="bg-emerald-50" />
                                <StatCard label="À Valider" val={stats.pending_validation} icon={<ShieldCheck/>} col="text-red-600" bg="bg-red-50" />
                                <StatCard label="Packs Actifs" val={stats.active_packs} icon={<Package/>} col="text-[#D4AF37]" bg="bg-[#D4AF37]/10" />
                            </div>
                        </motion.div>
                    )}

                    {subView === 'validation' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="validation" className="space-y-6">
                            {/* ... كود الـ Validation كيبقى هو هو ... */}
                            {pendingPrestataires.length === 0 ? (
                                <div className="bg-white p-20 rounded-[3.5rem] text-center border border-dashed border-stone-200">
                                    <p className="text-stone-400 font-medium italic text-left">Aucun prestataire en attente.</p>
                                </div>
                            ) : (
                                pendingPrestataires.map((p) => (
                                    <div key={p.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 flex items-center justify-between group hover:shadow-md transition-all">
                                        <div className="flex items-center gap-6 text-left">
                                            <div className="w-16 h-16 bg-stone-900 text-[#D4AF37] rounded-2xl flex items-center justify-center text-2xl font-bold">
                                                {p.nom_commercial?.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-stone-800">{p.nom_commercial}</h4>
                                                <div className="flex gap-3 mt-1">
                                                    <span className="text-[10px] bg-emerald-50 text-[#047857] px-3 py-1 rounded-full font-black uppercase">{p.type}</span>
                                                    <span className="text-[10px] text-stone-400 font-bold uppercase">📍 {p.ville}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => setSelectedPrestataire(p)} className="p-4 bg-stone-50 text-stone-400 hover:text-stone-800 rounded-2xl flex items-center gap-2 font-bold text-sm transition">
                                                <Eye size={18} /> Profil
                                            </button>
                                            <button onClick={() => handleValidate(p.id)} className="p-4 bg-[#047857] text-white rounded-2xl shadow-lg flex items-center gap-2 font-bold text-sm hover:scale-105 transition">
                                                <ShieldCheck size={18} /> Valider
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {subView === 'packs' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="packs" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* فورم إضافة Pack جديد */}
                            <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 h-fit">
                                <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2"><PlusCircle className="text-[#D4AF37]"/> Nouveau Pack</h3>
                                <form onSubmit={handleCreatePack} className="space-y-4">
                                    <input placeholder="Nom du Pack" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                                        value={newPack.nom} onChange={e => setNewPack({...newPack, nom: e.target.value})} />
                                    
                                    <textarea placeholder="Description" required className="w-full p-4 bg-gray-50 rounded-2xl h-32 outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                                        value={newPack.description} onChange={e => setNewPack({...newPack, description: e.target.value})} />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Prix Estime" required className="p-4 bg-gray-50 rounded-2xl outline-none"
                                            value={newPack.prix_estime} onChange={e => setNewPack({...newPack, prix_estime: e.target.value})} />
                                        <input type="number" placeholder="Réduction %" required className="p-4 bg-gray-50 rounded-2xl outline-none"
                                            value={newPack.reduction_pct} onChange={e => setNewPack({...newPack, reduction_pct: e.target.value})} />
                                    </div>

                                    <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" 
                                        value={newPack.type} onChange={e => setNewPack({...newPack, type: e.target.value})}>
                                        <option value="essentiel">Essentiel</option>
                                        <option value="confort">Confort</option>
                                        <option value="premium">Premium</option>
                                    </select>

                                    <button type="submit" className="w-full py-4 bg-stone-900 text-[#D4AF37] rounded-2xl font-bold hover:bg-stone-800 transition shadow-lg">Créer le Pack</button>
                                </form>
                            </div>

                            {/* عرض الـ Packs الحالية */}
                            <div className="lg:col-span-2 space-y-4">
                                {packs.map(pack => (
                                    <div key={pack.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 flex justify-between items-center group">
                                        <div className="text-left">
                                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${pack.type === 'premium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {pack.type}
                                            </span>
                                            <h4 className="text-xl font-bold text-stone-800 mt-2">{pack.nom}</h4>
                                            <p className="text-sm text-stone-400 mt-1">{pack.prix_estime} DH — <span className="text-emerald-500">-{pack.reduction_pct}%</span></p>
                                        </div>
                                        <button onClick={() => handleDeletePack(pack.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition">
                                            <Trash2 size={20}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal الـ Profil كيبقى خدام بنفس الطريقة */}
                <AnimatePresence>
                    {selectedPrestataire && (
                        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden text-left">
                                <div className="bg-stone-900 p-8 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-2xl font-bold">{selectedPrestataire.nom_commercial?.charAt(0)}</div>
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold">{selectedPrestataire.nom_commercial}</h3>
                                            <p className="text-stone-400 text-xs uppercase font-black tracking-widest">{selectedPrestataire.type}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedPrestataire(null)} className="p-2 hover:bg-white/10 rounded-full transition"><XCircle size={24}/></button>
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="grid grid-cols-2 gap-8 text-left">
                                        <div className="space-y-1"><p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Responsable</p><p className="font-bold text-stone-800">{selectedPrestataire.user?.prenom} {selectedPrestataire.user?.nom}</p></div>
                                        <div className="space-y-1"><p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Ville</p><p className="font-bold text-stone-800">{selectedPrestataire.ville}</p></div>
                                        <div className="space-y-1"><p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Email</p><p className="font-bold text-stone-800 flex items-center gap-2"><Mail size={14}/> {selectedPrestataire.user?.email}</p></div>
                                        <div className="space-y-1"><p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Téléphone</p><p className="font-bold text-emerald-600 flex items-center gap-2"><Phone size={14}/> {selectedPrestataire.telephone}</p></div>
                                    </div>
                                    <div className="pt-8 border-t border-stone-100">
                                        <button onClick={() => handleValidate(selectedPrestataire.id)} className="w-full py-5 bg-[#047857] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-900/10 hover:bg-[#035e44] transition flex items-center justify-center gap-3">
                                            <CheckCircle size={20}/> Confirmer la validation
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

function StatCard({ label, val, icon, col, bg }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 transition-all hover:translate-y-[-5px]">
            <div className={`w-12 h-12 ${bg} ${col} rounded-2xl flex items-center justify-center mb-4`}>{icon}</div>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-bold text-stone-800 mt-1">{val}</p>
        </div>
    );
}