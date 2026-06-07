import { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom/client';
import { 
    LayoutDashboard, LogOut, PlusCircle, Utensils, Home as HomeIcon,
    User, Calendar, FileText
} from 'lucide-react'; 
import React from 'react';
import '../css/app.css';

// استيراد المكونات
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CouplesDashboard from './components/CouplesDashboard'; 
import AddSalleForm from './components/SalleForm';
import AddFormuleForm from './components/FormuleForm';
import FormuleList from './components/FormuleList'; 
import SalleList from './components/SalleList';
import Profile from './components/Profile';
import BudgetEstimator from './components/BudgetEstimator'; 
import Marketplace from './components/Marketplace'; 
import AdminDashboard from './components/AdminDashboard';
import PacksPage from "./components/PacksPage"; 

import PrestataireCalendar from './components/PrestataireCalendar';
import DemandeDevisForm from './components/DemandeDevisForm';
import PrestataireDevis from './components/PrestataireDevis'; 
import WeddingBot from './components/WeddingBot';

function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('home');
    
    // هاد الستيت غاتتحكم لينا واش نcrossيو الفورم وسط الدشبرد (list لتعني القائمة، و add لتعني الفورم)
    const [subView, setSubView] = useState('list'); 
    const [targetPrestataire, setTargetPrestataire] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        setView('home');
        localStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
    };

    const handleLoginSuccess = (userData, userRole) => {
        setUser(userData);
        
        if (userData.prestataire) {
            localStorage.setItem('prestataire_id', userData.prestataire.id);
            localStorage.setItem('user_type', userData.prestataire.type);
        }
        
        if (userRole === 'admin') {
            setView('admin_dashboard');
        } else if (userRole === 'couple') {
            setView('couple_dashboard');
        } else {
            setView('prestataire_dashboard');
            setSubView('list'); // كيبدأ ديما بالقائمة
        }
    };

    const BlackList = ['prestataire_dashboard', 'prestataire_devis', 'profile', 'prestataire_calendar', 'admin_dashboard', 'couple_dashboard'];
    const isPublicPage = !BlackList.includes(view);

    const prestataireType = user?.prestataire?.type;
    const showWeddingBot = ['home', 'budget_estimator', 'marketplace', 'couple_dashboard', 'packs', 'demande_devis'].includes(view);

    return (
        <div className="w-full h-screen bg-[#F9F7F2] font-sans text-gray-800 flex flex-col relative overflow-hidden">
            
            <div className="flex flex-1 overflow-hidden relative w-full h-full">
                <AnimatePresence mode="wait">

                    {isPublicPage && (
                        <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full overflow-y-auto">
                            {view === 'home' && <Home onStart={() => setView('register')} setView={setView} view={view} />}
                            {view === 'budget_estimator' && <BudgetEstimator setView={setView} />}
                            {view === 'marketplace' && <Marketplace setView={setView} setTargetPrestataire={setTargetPrestataire} />}
                            {view === 'demande_devis' && <DemandeDevisForm setView={setView} targetPrestataire={targetPrestataire} />}
                            {view === 'packs' && <PacksPage setView={setView} />}
                            {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setView('register')} />}
                            {view === 'register' && <Register onRegisterSuccess={() => setView('login')} onSwitchToLogin={() => setView('login')} />}
                        </motion.div>
                    )}

                    {view === 'admin_dashboard' && user && (
                        <AdminDashboard user={user} onLogout={handleLogout} />
                    )}

                    {/* واجهة الممون الكاملة بـ الديزاين الموحد */}
                    {(view === 'prestataire_dashboard' || view === 'prestataire_devis' || view === 'profile' || view === 'prestataire_calendar') && (
                        <motion.div key="prestataire" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full h-full overflow-hidden">
                            
                            {/* Sidebar الجانبي */}
                            <aside className="w-64 bg-[#233D37] text-white flex flex-col h-full flex-shrink-0 z-20 shadow-xl border-r border-[#1E352F]">
                                <div>
                                    <div className="h-24 bg-[#1E352F] flex items-center justify-center border-b border-[#2A4840]">
                                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4B97C] italic">OURS</h2>
                                    </div>
                                    
                                    <nav className="p-0 flex-1">
                                        <button 
                                            onClick={() => { setView('prestataire_dashboard'); setSubView('list'); }} 
                                            className={`w-full p-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all border-b border-[#1E352F]/40 ${
                                                (view === 'prestataire_dashboard' && subView === 'list') 
                                                ? 'bg-[#D4B97C] text-[#233D37] font-bold shadow-inner' 
                                                : 'bg-[#F9F7F2] text-[#233D37] hover:bg-[#EBE7DC]'
                                            }`}
                                        >
                                            <LayoutDashboard size={16}/> Dashboard
                                        </button>
                                        
                                        <button 
                                            onClick={() => setView('prestataire_devis')} 
                                            className={`w-full p-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all border-b border-[#1E352F]/40 ${
                                                view === 'prestataire_devis' 
                                                ? 'bg-[#D4B97C] text-[#233D37] font-bold shadow-inner' 
                                                : 'bg-[#F9F7F2] text-[#233D37] hover:bg-[#EBE7DC]'
                                            }`}
                                        >
                                            <FileText size={16}/> Demandes Devis
                                        </button>
                                        
                                        <button 
                                            onClick={() => setView('prestataire_calendar')} 
                                            className={`w-full p-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all border-b border-[#1E352F]/40 ${
                                                view === 'prestataire_calendar' 
                                                ? 'bg-[#D4B97C] text-[#233D37] font-bold shadow-inner' 
                                                : 'bg-[#F9F7F2] text-[#233D37] hover:bg-[#EBE7DC]'
                                            }`}
                                        >
                                            <Calendar size={16}/> Mon Calendrier
                                        </button>

                                        <button 
                                            onClick={() => setView('profile')} 
                                            className={`w-full p-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all border-b border-[#1E352F]/40 ${
                                                view === 'profile' 
                                                ? 'bg-[#D4B97C] text-[#233D37] font-bold shadow-inner' 
                                                : 'bg-[#F9F7F2] text-[#233D37] hover:bg-[#EBE7DC]'
                                            }`}
                                        >
                                            <User size={16}/> Mon Profil
                                        </button>

                                        <button 
                                            onClick={handleLogout} 
                                            className="w-full p-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all bg-[#F9F7F2] text-red-700 hover:bg-red-50 border-b border-[#1E352F]/40"
                                        >
                                            <LogOut size={16}/> Déconnexion
                                        </button>
                                        
                                        {/* زر الإضافة دابا كيبدل غير الـ subView وسط الدشبرد ومكيديناش لباج أخرى */}
                                        <div className="p-4">
                                            <button 
                                                onClick={() => { setView('prestataire_dashboard'); setSubView('add'); }} 
                                                className={`w-full p-3 text-xs uppercase tracking-wider font-semibold rounded-xl border transition flex items-center gap-3 justify-center shadow ${
                                                    subView === 'add' 
                                                    ? 'bg-[#D4B97C] text-[#233D37] border-[#D4B97C]' 
                                                    : 'bg-[#1E352F] border-[#D4B97C]/30 text-[#D4B97C] hover:bg-[#2A4840]'
                                                }`}
                                            >
                                                <PlusCircle size={16}/> {prestataireType === 'traiteur' ? 'Ajouter Formule' : 'Ajouter Salle'}
                                            </button>
                                        </div>
                                    </nav>
                                </div>
                            </aside>

                            {/* محتوى الصفحة الرئيسي */}
                            <main className="flex-1 p-10 bg-[#F9F7F2] overflow-y-auto text-left">
                                <div className="max-w-5xl mx-auto">
                                    
                                    {view === 'prestataire_dashboard' && (
                                        <>
                                            {/* الهيدر العلوي */}
                                            <header className="mb-10 text-center border-b pb-6 border-gray-200">
                                                <h1 className="text-2xl font-bold tracking-widest text-[#233D37] uppercase">
                                                    {prestataireType === 'traiteur' ? "GESTION DES FORMULES" : "GESTION DES SALLES"}
                                                </h1>
                                                <p className="text-sm text-gray-400 mt-2 italic font-serif">
                                                    Bienvenue, {user?.prenom} • Espace {prestataireType}
                                                </p>
                                            </header>

                                            {/* التحكم فالعرض بناء على الـ subView */}
                                            {subView === 'list' ? (
                                                <div className="bg-[#233D37]/5 rounded-[2.5rem] p-8 border border-gray-100">
                                                    {prestataireType === 'traiteur' ? (
                                                        <FormuleList prestataireId={localStorage.getItem('prestataire_id')} />
                                                    ) : (
                                                        <SalleList prestataireId={localStorage.getItem('prestataire_id')} />
                                                    )}
                                                    {/* زر إضافي لتحويل العرض للفورم من وسط الصفحة */}
                                                    <div className="flex justify-center mt-6">
                                                        <button 
                                                            onClick={() => setSubView('add')}
                                                            className="bg-[#233D37] text-[#D4B97C] px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#1E352F] transition"
                                                        >
                                                            + {prestataireType === 'traiteur' ? 'Nouveau Formule' : 'Nouveau Salle'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* 🟡 هنا تم تطبيق ديزاين الكارت الذهبي الدائري المستوحى من صورة image_4bea1d.png */
                                                <div className="max-w-md mx-auto bg-[#D4B97C] rounded-[2.5rem] p-8 shadow-xl border border-[#c4a96c]/40 text-center text-[#233D37]">
                                                    <div className="flex items-center justify-center gap-2 mb-6 font-bold uppercase tracking-widest text-sm text-[#233D37]">
                                                        <PlusCircle size={18} /> 
                                                        {prestataireType === 'traiteur' ? 'Nouveau Formule' : 'Nouveau Salle'}
                                                    </div>
                                                    
                                                    {/* استدعاء المكونات بدون الانتقال لصفحة أخرى */}
                                                    {prestataireType === 'traiteur' ? (
                                                        <AddFormuleForm 
                                                            prestataireId={localStorage.getItem('prestataire_id')} 
                                                            onSuccess={() => setSubView('list')} 
                                                        />
                                                    ) : (
                                                        <AddSalleForm 
                                                            prestataireId={localStorage.getItem('prestataire_id')} 
                                                            onSuccess={() => setSubView('list')} 
                                                        />
                                                    )}

                                                    <button 
                                                        onClick={() => setSubView('list')} 
                                                       className="w-full bg-[#233D37] text-[#F9F7F2] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl border border-[#233D37] hover:bg-[#1E352F] transition-all shadow"
                                                    >
                                                        Annuler et retourner
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {view === 'prestataire_devis' && (
                                        <PrestataireDevis prestataireId={localStorage.getItem('prestataire_id')} />
                                    )}

                                    {view === 'profile' && <Profile user={user} />}
                                    {view === 'prestataire_calendar' && <PrestataireCalendar />}
                                </div>
                            </main>
                        </motion.div>
                    )}

                    {view === 'couple_dashboard' && (
                        <motion.div key="couple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full overflow-hidden">
                            <CouplesDashboard user={user} onLogout={handleLogout} />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {showWeddingBot && <WeddingBot userId={user?.id} />}
        </div>
    );
}

const root = document.getElementById('app');
if (root) {
    ReactDOM.createRoot(root).render(<App />);
}

export default App;