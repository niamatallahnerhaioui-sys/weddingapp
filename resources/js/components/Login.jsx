// resources/js/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/login', formData);
            
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            }
            
            if (res.data.user && res.data.user.prestataire) {
                localStorage.setItem('prestataire_id', res.data.user.prestataire.id);
            }

            onLoginSuccess(res.data.user, res.data.role);
            
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Email ou mot de passe incorrect";
            alert(errorMsg);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#F3EFEA] flex flex-col items-center justify-center font-serif p-4 select-none">
            
            {/* حاوية الفورم المركزية - مدمجة ومطابقة للتصميم المرجعي */}
            <div className="w-full max-w-sm flex flex-col items-center bg-transparent">
                
                {/* العنوان الرئيسي العلوي */}
                <h1 className="text-2xl sm:text-3xl tracking-widest text-[#1E2E28] font-light uppercase mb-1">
                    CONNEXION
                </h1>
                
                {/* العنوان الفرعي مع خط فاصل شفاف من الأسفل */}
                <h2 className="text-xs tracking-wider text-[#1E2E28] uppercase font-semibold mb-8 border-b border-[#1E2E28]/20 pb-2 w-full text-center">
                    CONNECTEZ-VOUS À VOTRE ESPACE
                </h2>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    
                    {/* حقل الإدخال: EMAIL باللون الذهبي المطلوب BC9414 */}
                    <div className="w-full">
                        <div className="flex items-center bg-[#BC9414] px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase">
                            <span className="mr-2 text-xs">✉</span> EMAIL
                        </div>
                        <input 
                            type="email" 
                            className="w-full p-2.5 bg-[#EADCC5]/60 border-none outline-none text-[#1E2E28] font-sans text-sm focus:bg-[#EADCC5] transition-all"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    {/* حقل الإدخال: PASSWORD باللون الذهبي المطلوب BC9414 */}
                    <div className="w-full">
                        <div className="flex items-center bg-[#BC9414] px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase">
                            <span className="mr-2 text-xs">🔒</span> PASSWORD
                        </div>
                        <input 
                            type="password" 
                            className="w-full p-2.5 bg-[#EADCC5]/60 border-none outline-none text-[#1E2E28] font-sans text-sm focus:bg-[#EADCC5] transition-all"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    {/* زر الدخول المستطيل بالأخضر الداكن المميز */}
                    <button 
                        type="submit" 
                        className="w-full bg-[#4A6157] text-white py-2 text-xs tracking-widest uppercase font-bold hover:bg-[#3D5249] transition-all duration-300 mt-2"
                    >
                        SE CONNECTER
                    </button>

                    {/* رابط الانتقال لإنشاء حساب مصلح بلون متناسق */}
                    <div className="text-center pt-2">
                        <p className="text-[#1E2E28]/70 text-xs tracking-wider">
                            Nouveau ?{' '}
                            <span 
                                onClick={onSwitchToRegister} 
                                className="text-[#BC9414] cursor-pointer font-bold hover:underline ml-1"
                            >
                                Créer un compte
                            </span>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Login;