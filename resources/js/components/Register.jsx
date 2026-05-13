import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // هذا هو السطر اللي كان ناقص وكيفرقع الصفحة
import { User, ChefHat, Mail, Lock, MapPin, Phone, Building2 } from 'lucide-react';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
    const [role, setRole] = useState('couple'); // 'couple' أو 'prestataire'
    const [formData, setFormData] = useState({
        nom: '', 
        prenom: '', 
        email: '', 
        password: '', 
        ville: 'Casablanca',
        telephone: '', 
        type: 'salle', 
        nom_commercial: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // تنظيف البيانات: نصيفتو فقط اللي كيحتاجو السيستم على حساب الـ Role
        let dataToSend = {
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            password: formData.password,
            ville: formData.ville,
            role: role 
        };

        if (role === 'prestataire') {
            dataToSend.telephone = formData.telephone;
            dataToSend.type = formData.type;
            dataToSend.nom_commercial = formData.nom_commercial;
        }

        try {
            const response = await axios.post('/api/register', dataToSend);
            alert("Inscription réussie !");
            onRegisterSuccess();
        } catch (error) {
            console.error(error.response?.data);
            const errors = error.response?.data?.errors;
            if (errors) {
                alert("Erreur: " + Object.values(errors).flat().join('\n'));
            } else {
                alert("Une erreur est survenue.");
            }
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-50 text-left">
            <h2 className="text-4xl font-serif font-bold text-center mb-8 italic text-gray-800">Inscription</h2>
            
            {/* إختيار النوع: Couple أو Prestataire */}
            <div className="flex border rounded-2xl overflow-hidden mb-8 p-1 bg-gray-50">
                <button 
                    type="button"
                    onClick={() => setRole('couple')}
                    className={`flex-1 py-3 font-bold transition-all rounded-xl ${role === 'couple' ? 'bg-[#047857] text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    Couple
                </button>
                <button 
                    type="button"
                    onClick={() => setRole('prestataire')}
                    className={`flex-1 py-3 font-bold transition-all rounded-xl ${role === 'prestataire' ? 'bg-[#047857] text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    Prestataire
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        placeholder="Nom" 
                        required 
                        value={formData.nom}
                        onChange={e => setFormData({...formData, nom: e.target.value})} 
                        className="p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                    />
                    <input 
                        placeholder="Prénom" 
                        required 
                        value={formData.prenom}
                        onChange={e => setFormData({...formData, prenom: e.target.value})} 
                        className="p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                    />
                </div>
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                />
                
                <input 
                    type="password" 
                    placeholder="Mot de passe" 
                    required 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                />

                {/* خانات الـ Prestataire تظهر فقط عند اختياره */}
                {role === 'prestataire' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-4"
                    >
                        <input 
                            placeholder="Nom Commercial" 
                            required 
                            value={formData.nom_commercial}
                            onChange={e => setFormData({...formData, nom_commercial: e.target.value})} 
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#047857]" 
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                placeholder="Téléphone" 
                                required 
                                value={formData.telephone}
                                onChange={e => setFormData({...formData, telephone: e.target.value})} 
                                className="p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#047857]" 
                            />
                            <select 
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})} 
                                className="p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#047857]"
                            >
                                <option value="salle">Salle de fête</option>
                                <option value="traiteur">Traiteur</option>
                            </select>
                        </div>
                    </motion.div>
                )}

                <button 
                    type="submit" 
                    className="w-full bg-[#047857] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#035e44] transition-all shadow-lg shadow-emerald-100"
                >
                    S'inscrire en tant que {role === 'couple' ? 'Couple' : 'Prestataire'}
                </button>
            </form>
            
            <p className="text-center mt-6 text-gray-400 font-medium">
                Déjà inscrit ? <button onClick={onSwitchToLogin} className="text-[#047857] font-bold hover:underline">Connectez-vous</button>
            </p>
        </div>
    );
}