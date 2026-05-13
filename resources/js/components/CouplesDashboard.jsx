import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, Calendar, Wallet, FileText, CheckCircle2, 
    LogOut, Bell, ChevronRight, User, Save, Camera, 
    TrendingUp, Clock, Info, Sparkles, Plus, X
} from 'lucide-react';

export default function CouplesDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showNotifications, setShowNotifications] = useState(false);
    
    const [profileData, setProfileData] = useState({
        nom: user?.nom || 'N',
        prenom: user?.prenom || 'Niamatallah',
        email: user?.email || '11nina@gmail.com',
        ville: user?.ville || 'Casablanca',
        budget_total: user?.budget_total || 150000,
        budget_depense: 45000,
        date_mariage: user?.date_mariage || '2026-06-30'
    });

    const [tasks, setTasks] = useState([
        { id: 1, text: "Réserver la salle de fête", completed: false },
        { id: 2, text: "Choisir le traiteur", completed: true },
    ]);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskText, setNewTaskText] = useState("");

    const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const addTask = () => {
        if (newTaskText.trim()) {
            setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false }]);
            setNewTaskText("");
            setIsAddingTask(false);
        }
    };

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });
    useEffect(() => {
        const calculateTime = () => {
            const target = new Date(profileData.date_mariage);
            const now = new Date();
            const diff = target - now;
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24)
                });
            }
        };
        calculateTime();
        const timer = setInterval(calculateTime, 60000);
        return () => clearInterval(timer);
    }, [profileData.date_mariage]);

    const progressPercent = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) || 0;

    return (
        <div className="flex h-screen w-full bg-[#FDFBF9] overflow-hidden text-left font-sans">
            
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-stone-100 flex flex-col p-6 shadow-sm flex-shrink-0 z-50">
                <div className="mb-10 px-2 text-center cursor-pointer" onClick={() => window.location.href='/'}>
                    <h2 className="text-2xl font-serif font-bold text-[#047857] italic">Elite Wedding</h2>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 font-bold">Espace Couple</p>
                </div>
                <nav className="space-y-2 flex-1 font-bold">
                    {[
                        { id: 'overview', label: "Vue d'ensemble", icon: <TrendingUp size={18}/> },
                        { id: 'planning', label: 'Planning', icon: <CheckCircle2 size={18}/> },
                        { id: 'budget', label: 'Budget & Devis', icon: <Wallet size={18}/> },
                        { id: 'favoris', label: 'Mes Favoris', icon: <Heart size={18}/> },
                        { id: 'profile', label: 'Mon Profil', icon: <User size={18}/> },
                    ].map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-[#047857] text-white shadow-xl' : 'text-stone-400 hover:bg-stone-50'}`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
                <button onClick={onLogout} className="flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold mt-auto border-t pt-6"><LogOut size={18}/> Déconnexion</button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12 relative bg-stone-50/20">
                
                {/* Header fix to prevent overlap (image_9b9148.png) */}
                <div className="flex justify-between items-start mb-12 relative z-20">
                    <h1 className="text-3xl font-serif font-bold text-stone-800 italic">
                        {activeTab === 'overview' ? `Bonjour, ${profileData.prenom} ! 👋` : 
                         activeTab === 'planning' ? 'Checklist Mariage' : 
                         activeTab === 'budget' ? 'Budget & Devis' : 
                         activeTab === 'favoris' ? 'Mes Favoris' : 'Paramètres du Profil'}
                    </h1>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 bg-white border border-stone-100 rounded-2xl text-stone-400 hover:text-[#047857] transition shadow-sm">
                                <Bell size={22} />
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-6 z-[70]">
                                        <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><Bell size={18} className="text-[#047857]" /> Notifications</h4>
                                        <div className="p-3 bg-stone-50 rounded-xl text-sm border-l-4 border-[#047857]">
                                            <p className="text-stone-700 leading-tight">Bienvenue sur votre Dashboard !</p>
                                            <span className="text-[10px] text-stone-400 font-bold">À l'instant</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {profileData.prenom.charAt(0)}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* 1. Overview */}
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-stone-100 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-[#047857]"></div>
                                    <Clock size={40} className="text-[#D4AF37] mx-auto mb-6" />
                                    <h3 className="text-stone-400 uppercase tracking-widest text-xs font-black mb-2">Compte à rebours</h3>
                                    <div className="flex gap-8 items-center justify-center mb-6">
                                        <div><p className="text-7xl font-black text-stone-800">{timeLeft.days}</p><p className="text-xs font-bold text-[#047857] uppercase">Jours</p></div>
                                        <div className="h-16 w-px bg-stone-100"></div>
                                        <div><p className="text-4xl font-black text-stone-300">{timeLeft.hours}h</p><p className="text-xs font-bold text-stone-200 uppercase">Heures</p></div>
                                    </div>
                                    <div className="inline-block px-6 py-2 bg-emerald-50 rounded-full text-[#047857] font-bold text-sm">Le {new Date(profileData.date_mariage).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                </div>
                                <div className="bg-white p-12 rounded-[4rem] shadow-lg border border-stone-100 text-center flex flex-col items-center">
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-stone-100" />
                                            <motion.circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 80} initial={{ strokeDashoffset: 2 * Math.PI * 80 }} animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - progressPercent / 100) }} className="text-[#047857]" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-stone-800">{progressPercent}%</span>
                                            <span className="text-[10px] font-bold text-stone-400 uppercase">Prêt</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 2. Planning */}
                    {activeTab === 'planning' && (
                        <motion.div key="planning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-stone-100 space-y-4">
                                {tasks.map(task => (
                                    <div key={task.id} className="flex items-center gap-4 p-5 bg-stone-50 rounded-2xl">
                                        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="w-6 h-6 rounded-lg text-[#047857] focus:ring-[#047857]" />
                                        <span className={`flex-1 font-bold ${task.completed ? 'text-stone-300 line-through' : 'text-stone-700'}`}>{task.text}</span>
                                    </div>
                                ))}
                                {isAddingTask ? (
                                    <div className="p-2 flex gap-3">
                                        <input autoFocus placeholder="Nouvelle tâche..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} className="flex-1 p-4 bg-emerald-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-[#047857] font-bold" />
                                        <button onClick={addTask} className="p-4 bg-[#047857] text-white rounded-2xl shadow-lg"><Plus/></button>
                                        <button onClick={() => setIsAddingTask(false)} className="p-4 bg-stone-100 text-stone-400 rounded-2xl"><X/></button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsAddingTask(true)} className="w-full py-4 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 font-bold flex items-center justify-center gap-2 transition-colors hover:border-[#047857] hover:text-[#047857]">+ Ajouter une tâche</button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 3. Budget & Devis (image_9b9148.png fix) */}
                    {activeTab === 'budget' && (
                        <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12">
                            <div className="bg-stone-900 p-12 rounded-[4rem] shadow-2xl text-white relative overflow-hidden">
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-2">
                                        <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Budget Initial</p>
                                        <p className="text-5xl font-serif font-bold text-[#D4AF37]">{profileData.budget_total.toLocaleString()} MAD</p>
                                    </div>
                                    <div className="md:pl-12 md:border-l border-white/5 space-y-2">
                                        <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Reste à dépenser</p>
                                        <p className="text-5xl font-black">{(profileData.budget_total - profileData.budget_depense).toLocaleString()} MAD</p>
                                    </div>
                                </div>
                                <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-[80px]"></div>
                            </div>
                            
                            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-100">
                                <h3 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2"><FileText size={20} className="text-[#047857]"/> Devis envoyés</h3>
                                <p className="text-stone-400 italic">Vous n'avez pas encore envoyé de demandes de devis.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* 4. Favoris (Heart Design preserved) */}
                    {activeTab === 'favoris' && (
                        <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center -mt-12">
                            <div className="w-40 h-40 bg-stone-50 rounded-full flex items-center justify-center mb-8 relative shadow-inner">
                                <Heart size={60} className="text-stone-200" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[#D4AF37]"><Sparkles size={20} /></motion.div>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2 italic">Coup de foudre en attente...</h3>
                            <p className="text-stone-400 max-w-sm mb-10 font-medium">Votre liste de favoris est vide. Explorez nos prestataires d'exception pour commencer à rêver.</p>
                            <button className="bg-[#047857] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#035e44] transition-all">Explorer les prestataires</button>
                        </motion.div>
                    )}

                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto text-left">
                            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8 italic text-left">Paramètres du Compte</h2>
                            <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2"><label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-2">Prénom</label><input value={profileData.prenom} onChange={e => setProfileData({...profileData, prenom: e.target.value})} className="w-full p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#047857]" /></div>
                                    <div className="space-y-2"><label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-2">Nom</label><input value={profileData.nom} onChange={e => setProfileData({...profileData, nom: e.target.value})} className="w-full p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#047857]" /></div>
                                    <div className="space-y-2 col-span-2"><label className="text-xs font-black text-[#047857] uppercase tracking-widest ml-2">💰 Budget Total du Mariage (MAD)</label><input type="number" value={profileData.budget_total} onChange={e => setProfileData({...profileData, budget_total: Number(e.target.value)})} className="w-full p-5 bg-emerald-50 text-[#047857] font-black text-2xl rounded-3xl border-none focus:ring-2 focus:ring-[#047857]" /></div>
                                    <div className="space-y-2"><label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-2">Date du Mariage</label><input type="date" value={profileData.date_mariage} onChange={e => setProfileData({...profileData, date_mariage: e.target.value})} className="w-full p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#047857]" /></div>
                                    <div className="space-y-2"><label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-2">Ville</label><input value={profileData.ville} onChange={e => setProfileData({...profileData, ville: e.target.value})} className="w-full p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#047857]" /></div>
                                </div>
                                <button className="w-full mt-10 py-5 bg-[#047857] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-[#035e44] transition-all"><Save size={20}/> Mettre à jour mon profil</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}