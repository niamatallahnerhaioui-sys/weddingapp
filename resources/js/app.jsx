import { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom/client';
import { 
    LayoutDashboard, LogOut, PlusCircle, Utensils, 
    User, Search, Menu, Heart, ChefHat, CheckCircle, TrendingUp 
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
import { TraiteursPage } from './components/TraiteursPage';
import AdminDashboard from './components/AdminDashboard';
function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('home');
    const [adminSubView, setAdminSubView] = useState('stats'); // للحالات داخل الـ Admin

    const handleLogout = () => {
        setUser(null);
        setView('home');
        localStorage.clear();
    };

    // دالة النجاح في الدخول الموحدة
    const handleLoginSuccess = (userData, userRole) => {
        setUser(userData);
        if (userData.prestataire) {
            localStorage.setItem('prestataire_id', userData.prestataire.id);
            localStorage.setItem('user_type', userData.prestataire.type);
        }
        
        // التوجيه الذكي حسب الـ Role
        if (userRole === 'admin') {
            setView('admin_dashboard');
        } else if (userRole === 'couple') {
            setView('couple_dashboard');
        } else {
            setView('prestataire_dashboard');
        }
    };

    const prestataireType = user?.prestataire?.type;
    const isPublicPage = view === 'home' || view === 'login' || view === 'register' || view === 'traiteurs';

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-800 flex flex-col">

            {/* --- 1. Navigation Bar العامة --- */}
            {isPublicPage && (
                <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-[100] h-20 py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-50 flex-shrink-0">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                        <span className="text-2xl"></span>
                        <h1 className="text-xl font-serif font-bold text-[#047857] italic">Elite Wedding</h1>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <button onClick={() => setView('home')} className={`hover:text-[#047857] transition ${view === 'home' ? 'text-[#047857]' : ''}`}>Accueil</button>
                        <button onClick={() => setView('login')} className="hover:text-[#047857] transition">Salles</button>
                        <button onClick={() => setView('traiteurs')} className={`hover:text-[#047857] transition ${view === 'traiteurs' ? 'text-[#047857]' : ''}`}>Traiteurs</button>
                        <button onClick={() => setView('login')} className="hover:text-[#047857] transition">Packs</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('register')} className="bg-[#047857] text-white px-6 py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#035e44] transition flex items-center gap-2">
                            <User size={16} /> Espace Pro
                        </button>
                    </div>
                </nav>
            )}

            {/* --- 2. محتوى الصفحة الرئيسي --- */}
            <div className="flex flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">

                    {/* A. واجهات الزوار العامة */}
                    {isPublicPage && (
                        <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full overflow-y-auto">
                            {view === 'home' && <Home onStart={() => setView('login')} />}
                            {view === 'traiteurs' && <TraiteursPage onNavigate={(p) => setView(p === 'accueil' ? 'home' : 'login')} />}
                            {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setView('register')} />}
                            {view === 'register' && <Register onRegisterSuccess={() => setView('login')} onSwitchToLogin={() => setView('login')} />}
                        </motion.div>
                    )}

                    {/* B. واجهة الـ Admin الجديدة (Elite Admin Panel) */}
                  {view === 'admin_dashboard' && user && (
    <AdminDashboard user={user} onLogout={handleLogout} />
)}

                    {/* C. واجهة الداشبورد (Prestataire) */}
                    {(view === 'prestataire_dashboard' || view === 'profile') && (
                        <motion.div key="prestataire" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full h-full overflow-hidden">
                            <aside className="w-64 bg-white border-r p-6 flex flex-col shadow-sm h-full flex-shrink-0 z-20">
                                <h2 className="text-xl font-serif font-bold text-[#047857] mb-10 italic text-center text-left">Elite Admin</h2>
                                <nav className="space-y-4 flex-1">
                                    <button onClick={() => setView('prestataire_dashboard')} className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-2 transition ${view === 'prestataire_dashboard' ? 'bg-emerald-50 text-[#047857]' : 'text-gray-400 hover:bg-gray-50'}`}>
                                        <LayoutDashboard size={18}/> Dashboard
                                    </button>
                                    <button onClick={() => setView('profile')} className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-2 transition ${view === 'profile' ? 'bg-emerald-50 text-[#047857]' : 'text-gray-400 hover:bg-gray-50'}`}>
                                        <User size={18}/> Mon Profil
                                    </button>
                                    <hr className="border-gray-100" />
                                    <button onClick={() => setView(prestataireType === 'traiteur' ? 'add_formule' : 'add_salle')} className="w-full text-left p-3 text-gray-400 hover:bg-emerald-50 hover:text-[#047857] rounded-xl transition flex items-center gap-2 text-left">
                                        <PlusCircle size={18}/> {prestataireType === 'traiteur' ? 'Ajouter Formule' : 'Ajouter Salle'}
                                    </button>
                                </nav>
                                <button onClick={handleLogout} className="p-3 text-red-400 hover:bg-red-50 rounded-xl mt-auto text-left font-bold flex items-center gap-2 border-t pt-4">
                                    <LogOut size={18}/> Déconnexion
                                </button>
                            </aside>

                            <main className="flex-1 p-10 bg-[#FAFAFA] overflow-y-auto text-left">
                                <div className="max-w-5xl mx-auto">
                                    {view === 'prestataire_dashboard' && (
                                        <>
                                            <header className="mb-10">
                                                <h2 className="text-3xl font-bold italic text-gray-800 tracking-tight">Bienvenue, <span className="text-[#047857] font-serif">{user?.prenom}</span></h2>
                                                <p className="text-gray-400 font-medium capitalize mt-1 border-l-4 border-[#D4AF37] pl-3 italic">Espace {prestataireType}</p>
                                            </header>
                                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                                                {prestataireType === 'traiteur' ? <FormuleList prestataireId={localStorage.getItem('prestataire_id')} /> : <SalleList prestataireId={localStorage.getItem('prestataire_id')} />}
                                            </div>
                                        </>
                                    )}
                                    {view === 'profile' && <Profile user={user} />}
                                </div>
                            </main>
                        </motion.div>
                    )}

                    {/* D. واجهة الكوبل */}
                    {view === 'couple_dashboard' && (
                        <motion.div key="couple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full overflow-hidden">
                            <CouplesDashboard user={user} onLogout={handleLogout} />
                        </motion.div>
                    )}

                    {/* E. واجهات الإضافة */}
                    {(view === 'add_salle' || view === 'add_formule') && (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full min-h-full bg-gray-50 p-10 overflow-y-auto">
                            <div className="max-w-4xl mx-auto">
                                <button onClick={() => setView('prestataire_dashboard')} className="mb-6 text-[#047857] font-bold flex items-center gap-2 hover:underline bg-white px-5 py-2 rounded-full shadow-sm shadow-emerald-900/5 text-left">
                                    ← Retour au Dashboard
                                </button>
                                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden text-left">
                                    {view === 'add_salle' ? <AddSalleForm prestataireId={localStorage.getItem('prestataire_id')} /> : <AddFormuleForm prestataireId={localStorage.getItem('prestataire_id')} />}
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

const root = document.getElementById('app');
if (root) {
    ReactDOM.createRoot(root).render(<App />);
}

export default App;