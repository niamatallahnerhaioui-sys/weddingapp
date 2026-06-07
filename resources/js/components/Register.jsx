// resources/js/components/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';

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
        <div className="min-h-screen w-full bg-[#F3EFEA] flex flex-col items-center justify-center font-serif p-4 select-none">
            
            {/* الحاوية المركزية النظيفة والمطابقة لأبعاد وحجم الـ Login */}
            <div className="w-full max-w-sm flex flex-col items-center bg-transparent">
                
                {/* العناوين الرئيسية */}
                <h1 className="text-2xl sm:text-3xl tracking-widest text-[#1E2E28] font-light uppercase mb-1">
                    INSCRIPTION
                </h1>
                
                <h2 className="text-xs tracking-wider text-[#1E2E28] uppercase font-semibold mb-6 border-b border-[#1E2E28]/20 pb-2 w-full text-center">
                    CRÉER VOTRE COMPTE COMPAGNON
                </h2>
                
                {/* شريط اختيار الـ Role - مستطيلات ناصعة ملتصقة تعبر عن الهوية المرجعية */}
                <div className="w-full flex text-center mb-6 text-[11px] font-bold tracking-widest uppercase">
                    <button 
                        type="button"
                        onClick={() => setRole('couple')}
                        className={`flex-1 py-2 transition-all duration-200 border-none outline-none ${
                            role === 'couple' 
                                ? 'bg-[#4A6157] text-white' 
                                : 'bg-[#EADCC5]/40 text-[#1E2E28]/50 hover:bg-[#EADCC5]/60'
                        }`}
                    >
                        COUPLE
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('prestataire')}
                        className={`flex-1 py-2 transition-all duration-200 border-none outline-none ${
                            role === 'prestataire' 
                                ? 'bg-[#4A6157] text-white' 
                                : 'bg-[#EADCC5]/40 text-[#1E2E28]/50 hover:bg-[#EADCC5]/60'
                        }`}
                    >
                        PRESTATAIRE
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    
                    {/* حقل الاسم والنسب - مقسم إلى عمودين متناسقين */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="w-full">
                            <div className="flex items-center bg-[#BC9414] px-2 py-1 text-[9px] font-bold tracking-widest text-white uppercase">
                                NOM
                            </div>
                            <input 
                                type="text"
                                placeholder="Nom" 
                                required 
                                value={formData.nom}
                                onChange={e => setFormData({...formData, nom: e.target.value})} 
                                className="w-full p-2.5 bg-[#EADCC5]/60 border-none outline-none text-[#1E2E28] font-sans text-sm focus:bg-[#EADCC5] transition-all" 
                            />
                        </div>
                        <div className="w-full">
                            <div className="flex items-center bg-[#BC9414] px-2 py-1 text-[9px] font-bold tracking-widest text-white uppercase">
                                PRENOM
                            </div>
                            <input 
                                type="text"
                                placeholder="Prénom" 
                                required 
                                value={formData.prenom}
                                onChange={e => setFormData({...formData, prenom: e.target.value})} 
                                className="w-full p-2.5 bg-[#EADCC5]/60 border-none outline-none text-[#1E2E28] font-sans text-sm focus:bg-[#EADCC5] transition-all" 
                            />
                        </div>
                    </div>
                    
                    {/* حقل EMAIL */}
                    <div className="w-full">
                        <div className="flex items-center bg-[#BC9414] px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase">
                            <span className="mr-2 text-xs">✉</span> EMAIL
                        </div>
                        <input 
                            type="email" 
                            required 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            className="w-full p-2.5 bg-[#EADCC5]/60 border-none outline-none text-[#1E2E28] font-sans text-sm focus:bg-[#EADCC5] transition-all" 
                        />
                    </div>
                    
                    {/* حقل PASSWORD */}
                    <div className="w-full">
                        <div className="flex items-center bg-[#BC9414] px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase">
                            <span className="mr-2 text-xs">🔒</span> PASSWORD
                        </div>
                        <input 
                            type="password" 
                            required 
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            className="w-full p-2.5 bg-[#EADCC5]/60 border-none outline-none text-[#1E2E28] font-sans text-sm focus:bg-[#EADCC5] transition-all" 
                        />
                    </div>

                    {/* الحقول الإضافية الخاصة بالـ Prestataire تفتح بنعومة هندسية متناسقة */}
                    {role === 'prestataire' && (
                        <div className="w-full space-y-4 animate-fade-in">
                            
                            {/* حقل الاسم التجاري */}
                            <div className="w-full">
                                <div className="flex items-center bg-[#BC9414] px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase">
                                    NOM COMMERCIAL
                                </div>
                                <input 
                                    type="text"
                                    required 
                                    value={formData.nom_commercial}
                                    onChange={e => setFormData({...formData, nom_commercial: e.target.value})} 
                                    className="w-full p-2.5 bg-[#EADCC5]/60 border-none outline-none text-[#1E2E28] font-sans text-sm focus:bg-[#EADCC5] transition-all" 
                                />
                            </div>

                            {/* حقل الهاتف والنوع */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="w-full">
                                    <div className="flex items-center bg-[#BC9414] px-2 py-1 text-[9px] font-bold tracking-widest text-white uppercase">
                                        TELEPHONE
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="06..."
                                        required 
                                        value={formData.telephone}
                                        onChange={e => setFormData({...formData, telephone: e.target.value})} 
                                        className="w-full p-2.5 bg-[#EADCC5]/60 border-none outline-none text-[#1E2E28] font-sans text-sm focus:bg-[#EADCC5] transition-all" 
                                    />
                                </div>
                                <div className="w-full">
                                    <div className="flex items-center bg-[#BC9414] px-2 py-1 text-[9px] font-bold tracking-widest text-white uppercase">
                                        TYPE
                                    </div>
                                    <select 
                                        value={formData.type}
                                        onChange={e => setFormData({...formData, type: e.target.value})} 
                                        className="w-full p-2.5 bg-[#EADCC5]/60 border-none outline-none text-[#1E2E28] font-sans text-sm focus:bg-[#EADCC5] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="salle">Salle de fête</option>
                                        <option value="traiteur">Traiteur</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* زر التسجيل المستطيل بالأخضر الداكن */}
                    <button 
                        type="submit" 
                        className="w-full bg-[#4A6157] text-white py-2 text-xs tracking-widest uppercase font-bold hover:bg-[#3D5249] transition-all duration-300 mt-4"
                    >
                        S'INSCRIRE
                    </button>
                </form>

                {/* رابط الانتقال لصفحة تسجيل الدخول */}
                <div className="text-center pt-4">
                    <p className="text-[#1E2E28]/70 text-xs tracking-wider">
                        Déjà inscrit ?{' '}
                        <span 
                            onClick={onSwitchToLogin} 
                            className="text-[#BC9414] cursor-pointer font-bold hover:underline ml-1"
                        >
                            Connectez-vous
                        </span>
                    </p>
                </div>

            </div>
        </div>
    );
}