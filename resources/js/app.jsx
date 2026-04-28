import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Store, User, Mail, Lock, MapPin, Phone, Briefcase, TextQuote } from 'lucide-react';
import axios from 'axios';

// تأكدي أن هاد المسار صحيح 100% في الملفات عندك
import CoupleDashboard from './components/couplesDashboard'; 

function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('login'); // صفحة البداية
    const [role, setRole] = useState('couple');
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({
        nom: '', prenom: '', email: '', password: '', ville: '',
        nom_commercial: '', type_service: '', telephone: '', description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/register', { ...formData, role });
            alert(res.data.message);
            setView('login');
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData?.errors) {
                alert("Erreur: " + Object.values(errorData.errors)[0][0]);
            } else {
                alert("Erreur: " + (errorData?.message || "Problème de connexion"));
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/login', { 
                email: formData.email, 
                password: formData.password 
            });
            setUser(res.data.user);
            setUserId(res.data.user.id);
            
            if (res.data.role === 'couple') {
                setView('couple_dashboard');
            } else {
                // إذا كان ممون ومازال ما كمل بروفايله
                setView('complete'); 
            }
        } catch (error) { 
            alert("Email أو كلمة السر خطأ"); 
        }
    };

    const handleComplete = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/complete-profile', {
                user_id: userId,
                nom_commercial: formData.nom_commercial,
                type_service: formData.type_service,
                telephone: formData.telephone,
                description: formData.description
            });
            alert("Profil complété avec succès !");
            window.location.reload(); 
        } catch (error) {
            alert("Erreur lors de la mise à jour");
        }
    };

    // --- الـ RETURN الواحد والوحيد ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                
                {/* 1. واجهة الـ Dashboard للـ Couple */}
                {view === 'couple_dashboard' && user && (
                    <motion.div key="dashboard" initial={{opacity:0}} animate={{opacity:1}} className="w-full h-full">
                        <CoupleDashboard user={user} />
                    </motion.div>
                )}

                {/* 2. واجهة الـ Register */}
                {view === 'register' && (
                    <motion.div key="reg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-white rounded-[2.5rem] shadow-2xl flex max-w-4xl w-full overflow-hidden min-h-[600px]">
                        <div className="hidden md:flex w-1/2 bg-pink-500 text-white p-12 flex-col justify-center items-center">
                            <h2 className="text-3xl font-bold mb-4 text-center">Rejoignez-nous</h2>
                            <p className="text-center">Le début de votre belle aventure commence ici.</p>
                        </div>
                        <div className="w-full md:w-1/2 p-10">
                            <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>
                            <div className="flex bg-gray-100 p-1 rounded-xl mb-6 relative cursor-pointer">
                                <motion.div animate={{ x: role === 'couple' ? '0%' : '100%' }} className="absolute bg-white shadow w-1/2 h-[85%] rounded-lg top-1 left-0" />
                                <button onClick={() => setRole('couple')} className="z-10 w-1/2 py-2">Couple</button>
                                <button onClick={() => setRole('prestataire')} className="z-10 w-1/2 py-2">Prestataire</button>
                            </div>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="flex gap-2">
                                    <input name="prenom" placeholder="Prénom" onChange={handleChange} required className="w-1/2 p-3 border rounded-xl" />
                                    <input name="nom" placeholder="Nom" onChange={handleChange} required className="w-1/2 p-3 border rounded-xl" />
                                </div>
                                <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border rounded-xl" />
                                <input name="ville" placeholder="Ville" onChange={handleChange} required className="w-full p-3 border rounded-xl" />
                                <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required className="w-full p-3 border rounded-xl" />
                                <button type="submit" className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold">S'inscrire</button>
                                <p className="text-center text-sm mt-2">Déjà un compte ? <span onClick={() => setView('login')} className="text-pink-600 cursor-pointer font-bold">Se connecter</span></p>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* 3. واجهة الـ Login */}
                {view === 'login' && (
                    <motion.div key="log" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md">
                        <h1 className="text-2xl font-bold mb-6 text-center text-purple-700 font-serif">Connexion</h1>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative"><Mail className="absolute left-3 top-3.5 text-gray-400" size={18}/><input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border rounded-xl" required /></div>
                            <div className="relative"><Lock className="absolute left-3 top-3.5 text-gray-400" size={18}/><input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border rounded-xl" required /></div>
                            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-lg">Se connecter</button>
                            <p className="text-center text-sm mt-4">Nouveau ? <span onClick={() => setView('register')} className="text-purple-600 cursor-pointer font-bold">Créer un compte</span></p>
                        </form>
                    </motion.div>
                )}

                {/* 4. واجهة إكمال البروفايل للممون */}
                {view === 'complete' && (
                    <motion.div key="comp" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-lg border-t-8 border-pink-500">
                        <h1 className="text-2xl font-bold mb-2 text-gray-800">Complétez votre profil Pro</h1>
                        <form onSubmit={handleComplete} className="space-y-4">
                            <div className="relative"><Briefcase className="absolute left-3 top-3.5 text-gray-400" size={18}/><input name="nom_commercial" placeholder="Nom de l'entreprise" onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-50 border rounded-xl" /></div>
                            <div className="relative"><Store className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                                <select name="type_service" onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-50 border rounded-xl">
                                    <option value="">Type de Service</option>
                                    <option value="salle">Salle de fête</option>
                                    <option value="traiteur">Traiteur</option>
                                    <option value="photographe">Photographe</option>
                                </select>
                            </div>
                            <div className="relative"><Phone className="absolute left-3 top-3.5 text-gray-400" size={18}/><input name="telephone" placeholder="Téléphone" onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-50 border rounded-xl" /></div>
                            <textarea name="description" placeholder="Description..." onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl h-24"></textarea>
                            <button type="submit" className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold shadow-xl">Enregistrer</button>
                        </form>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);