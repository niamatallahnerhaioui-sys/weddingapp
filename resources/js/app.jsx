import { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom/client';
import { 
    LayoutDashboard, LogOut, PlusCircle, Utensils, 
    User, Search, Menu, Heart, ChefHat, CheckCircle, TrendingUp, Calendar, FileText
} from 'lucide-react'; 
import React from 'react';
import '../css/app.css';

// استيراد المكونات القديمة والجديدة
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

// استيراد المكونات الجديدة (Sprint 5)
import PrestataireCalendar from './components/PrestataireCalendar';
import DemandeDevisForm from './components/DemandeDevisForm';

// 🔥 استيراد الـ WeddingBot المحدث
import WeddingBot from './components/WeddingBot';

function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('home');
    const [adminSubView, setAdminSubView] = useState('stats');
    
    // State لتخزين البريستاتير الذي تم اختياره لإرسال الدوفيس له
    const [targetPrestataire, setTargetPrestataire] = useState(null);

    // كود فحص الـ Token وتثبيته في الـ Axios تلقائياً عند الدخول
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
        }
    };

    const BlackList = ['prestataire_dashboard', 'profile', 'prestataire_calendar', 'admin_dashboard', 'couple_dashboard', 'add_salle', 'add_formule'];
    const isPublicPage = !BlackList.includes(view);

    const prestataireType = user?.prestataire?.type;

    // 🎯 تحديد الصفحات التي يجب أن يظهر فيها الـ WeddingBot
    const allowedBotViews = ['home', 'budget_estimator', 'marketplace', 'couple_dashboard', 'packs', 'demande_devis'];
    const showWeddingBot = allowedBotViews.includes(view);

    return (
        // تم تغيير الـ الهيكلة هنا بـ h-screen و flex-col مع ضبط الـ relative لتفادي أي تداخل
        <div className="w-full h-screen bg-[#FAFAFA] font-sans text-gray-800 flex flex-col relative overflow-hidden">
            
            <div className="flex flex-1 overflow-hidden relative w-full h-full">
                <AnimatePresence mode="wait">

                    {isPublicPage && (
                        <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full overflow-y-auto">
                            {view === 'home' && (
                                <Home 
                                    onStart={() => setView('register')} 
                                    setView={setView} 
                                    view={view} 
                                />
                            )}
                            {view === 'budget_estimator' && (
                                <BudgetEstimator setView={setView} />
                            )}
                            {view === 'marketplace' && (
                                <Marketplace 
                                    setView={setView} 
                                    setTargetPrestataire={setTargetPrestataire} 
                                />
                            )}
                            {view === 'demande_devis' && (
                                <DemandeDevisForm 
                                    setView={setView} 
                                    targetPrestataire={targetPrestataire} 
                                />
                            )}
                            {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setView('register')} />}
                            {view === 'register' && <Register onRegisterSuccess={() => setView('login')} onSwitchToLogin={() => setView('login')} />}
                        </motion.div>
                    )}

                    {view === 'admin_dashboard' && user && (
                        <AdminDashboard user={user} onLogout={handleLogout} />
                    )}

                    {(view === 'prestataire_dashboard' || view === 'profile' || view === 'prestataire_calendar') && (
                        <motion.div key="prestataire" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full h-full overflow-hidden">
                            <aside className="w-64 bg-white border-r p-6 flex flex-col shadow-sm h-full flex-shrink-0 z-20">
                                <h2 className="text-xl font-serif font-bold text-[#047857] mb-10 italic text-center">Elite Admin</h2>
                                <nav className="space-y-4 flex-1">
                                    <button onClick={() => setView('prestataire_dashboard')} className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-2 transition ${view === 'prestataire_dashboard' ? 'bg-emerald-50 text-[#047857]' : 'text-gray-400 hover:bg-gray-50'}`}>
                                        <LayoutDashboard size={18}/> Dashboard
                                    </button>
                                    
                                    <button onClick={() => setView('prestataire_calendar')} className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-2 transition ${view === 'prestataire_calendar' ? 'bg-emerald-50 text-[#047857]' : 'text-gray-400 hover:bg-gray-50'}`}>
                                        <Calendar size={18}/> Mon Calendrier
                                    </button>

                                    <button onClick={() => setView('profile')} className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-2 transition ${view === 'profile' ? 'bg-emerald-50 text-[#047857]' : 'text-gray-400 hover:bg-gray-50'}`}>
                                        <User size={18}/> Mon Profil
                                    </button>
                                    
                                    <hr className="border-gray-100" />
                                    <button onClick={() => setView(prestataireType === 'traiteur' ? 'add_formule' : 'add_salle')} className="w-full text-left p-3 text-gray-400 hover:bg-emerald-50 hover:text-[#047857] rounded-xl transition flex items-center gap-2">
                                        <PlusCircle size={18}/> {prestataireType === 'traiteur' ? 'Ajouter Formule' : 'Ajouter Salle'}
                                    </button>
                                </nav>
                                <button onClick={handleLogout} className="p-3 text-red-400 hover:bg-red-50 rounded-xl mt-auto font-bold flex items-center gap-2 border-t pt-4 text-left">
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

            {/* 🤖 🎯 تم نقل البوت إلى هنا (خارج نطاق الـ flex و الـ overflow-hidden للـ Layout) */}
            {/* هاد التغيير غادي يخليه يطبق الـ fixed bottom-6 right-6 بحرية تامة وينزل لتحت على اليمن */}
            {showWeddingBot && <WeddingBot userId={user?.id} />}
        </div>
    );
}

const root = document.getElementById('app');
if (root) {
    ReactDOM.createRoot(root).render(<App />);
}

export default App;