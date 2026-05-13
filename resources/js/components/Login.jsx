// resources/js/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/login', formData);
            // نرسل المستخدم والـ role ومعلومات الـ prestataire (إلى كاين)
            onLoginSuccess(res.data.user, res.data.role, res.data.user.prestataire);
        } catch (error) {
            console.error(error);
            alert("Email ou mot de passe incorrect");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md border-t-8 border-[#047857]">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif font-bold text-[#047857] mb-2">Elite Wedding</h1>
                    <p className="text-gray-400">Connectez-vous à votre espace</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20}/>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#047857] transition-all"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20}/>
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#047857] transition-all"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-[#047857] text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg text-lg">
                        Se connecter
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-gray-500 text-sm">
                            Nouveau ? <span onClick={onSwitchToRegister} className="text-[#D4AF37] cursor-pointer font-bold hover:underline">Créer un compte</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;