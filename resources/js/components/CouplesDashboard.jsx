// resources/js/components/CoupleDashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, Info, Image as InspoIcon, 
    Calendar, Wallet, CheckSquare, Heart, 
    MapPin, Camera, Utensils, Music 
} from 'lucide-react';

const CoupleDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('home');

    // بيانات تجريبية لمحاكاة الصور التي أرسلتِها
    const budgetData = {
        total: 80000,
        paid: 18700,
        categories: [
            { id: 1, name: 'Venue & Catering', estimated: 35000, paid: 15000 },
            { id: 2, name: 'Photography', estimated: 5000, paid: 2500 },
            { id: 3, name: 'Planner', estimated: 3500, paid: 1200 },
        ]
    };

    const NavItem = ({ id, icon: Icon, label }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === id ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-pink-400'}`}
        >
            <Icon size={24} />
            <span className="text-xs mt-1 font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar للـ Desktop */}
            <nav className="hidden md:flex flex-col w-24 bg-white shadow-lg items-center py-8 gap-8">
                <div className="bg-pink-100 p-3 rounded-2xl text-pink-600"><Heart fill="currentColor" /></div>
                <NavItem id="home" icon={LayoutDashboard} label="Home" />
                <NavItem id="info" icon={Info} label="Info" />
                <NavItem id="budget" icon={Wallet} label="Budget" />
                <NavItem id="checklist" icon={CheckSquare} label="Tasks" />
            </nav>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 p-6 md:p-10 mb-20 md:mb-0 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.prenom}! 👋</h1>
                    <p className="text-gray-500">130 Days to go • 06/30/2025</p>
                </header>

                {/* قسم الميزانية (Budget View) - يطابق الصورة الأخيرة */}
                {activeTab === 'budget' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-100">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-gray-400 uppercase text-xs font-bold tracking-widest">Set Budget</p>
                                    <h2 className="text-4xl font-black text-gray-800">${budgetData.total.toLocaleString()}</h2>
                                </div>
                                <div className="bg-pink-500 text-white p-4 rounded-2xl text-center">
                                    <p className="text-xs opacity-80">Paid</p>
                                    <p className="font-bold">${budgetData.paid.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                                <div className="bg-pink-500 h-full" style={{ width: `${(budgetData.paid/budgetData.total)*100}%` }}></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {budgetData.categories.map(cat => (
                                <div key={cat.id} className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-gray-700">{cat.name}</h4>
                                        <p className="text-sm text-gray-400">Paid ${cat.paid} / Remaining ${cat.estimated - cat.paid}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-pink-600">${cat.estimated}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* قسم المعلومات (Vendor Info) - يطابق الصورة الأولى */}
                {activeTab === 'info' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex gap-4 bg-white p-2 rounded-2xl w-fit mx-auto mb-8 shadow-sm">
                            <button className="px-6 py-2 bg-pink-500 text-white rounded-xl font-bold">Vendor Info</button>
                            <button className="px-6 py-2 text-gray-500">Event Info</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'Ceremony Venue', icon: MapPin },
                                { name: 'Photographer', icon: Camera },
                                { name: 'Catering', icon: Utensils },
                                { name: 'Music / DJ', icon: Music },
                            ].map((v, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
                                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                                        <v.icon size={20} />
                                    </div>
                                    <span className="font-semibold text-gray-700">{v.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* الصفحة الرئيسية (Overview) */}
                {activeTab === 'home' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-8 rounded-[2.5rem] text-white">
                            <h3 className="text-xl font-bold mb-2">Countdown</h3>
                            <div className="text-5xl font-black mb-4">130 Days</div>
                            <p className="opacity-80">Until you say "I Do" 💍</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                             <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4 text-pink-500">
                                <Wallet size={32} />
                             </div>
                             <h3 className="font-bold text-gray-800">Remaining Budget</h3>
                             <p className="text-3xl font-black text-pink-600">${budgetData.total - budgetData.paid}</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Navigation للـ Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 px-2 z-50">
                <NavItem id="home" icon={LayoutDashboard} label="Home" />
                <NavItem id="info" icon={Info} label="Info" />
                <NavItem id="budget" icon={Wallet} label="Budget" />
                <NavItem id="checklist" icon={CheckSquare} label="Checklist" />
            </nav>
        </div>
    );
};

export default CoupleDashboard;