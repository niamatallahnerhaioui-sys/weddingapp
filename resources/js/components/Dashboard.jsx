import React from 'react';
import { PlusCircle } from 'lucide-react';
import FormuleList from './FormuleList'; 
import SalleList from './SalleList';
import AddSalleForm from './SalleForm';
import AddFormuleForm from './FormuleForm';

const Dashboard = ({ user, subView, setSubView }) => {
    console.log("User Data in Dashboard:", user);
    
    const prestataireInfo = user?.prestataire || {};
    const prestataireType = prestataireInfo.type; // 'traiteur' ou 'salle'
    const prestataireId = prestataireInfo.id || localStorage.getItem('prestataire_id');

    return (
        <div className="w-full">
            {/* الهيدر العلوي */}
            <header className="mb-10 text-center border-b pb-6 border-gray-200">
                <h1 className="text-2xl font-bold tracking-widest text-[#233D37] uppercase">
                    {prestataireType === 'traiteur' ? "GESTION DES FORMULES" : "GESTION DES SALLES"}
                </h1>
                <p className="text-sm text-gray-400 mt-2 italic font-serif">
                    Bienvenue, {user?.prenom} • Espace {prestataireType}
                </p>
            </header>

            {/* التحكم في العرض بناءً على الـ subView القادم من App.js */}
            {subView === 'list' ? (
                <div className="bg-[#233D37]/5 rounded-[2.5rem] p-8 border border-gray-100">
                    {/* عرض القائمة المناسبة */}
                    {prestataireType === 'traiteur' ? (
                        <FormuleList prestataireId={prestataireId} />
                    ) : (
                        <SalleList prestataireId={prestataireId} />
                    )}
                    
                    {/* زر إضافة عنصر جديد من وسط الصفحة */}
                    <div className="flex justify-center mt-6">
                        <button 
                            onClick={() => setSubView('add')}
                            className="bg-[#233D37] text-[#D4B97C] px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#1E352F] transition-all shadow-md flex items-center gap-2"
                        >
                            <PlusCircle size={14}/>
                            {prestataireType === 'traiteur' ? 'Nouveau Formule' : 'Nouveau Salle'}
                        </button>
                    </div>
                </div>
            ) : (
                /* ديزاين الكارت الذهبي الدائري للفورم */
                <div className="max-w-md mx-auto bg-[#D4B97C] rounded-[2.5rem] p-8 shadow-xl border border-[#c4a96c]/40 text-center text-[#233D37]">
                    <div className="flex items-center justify-center gap-2 mb-6 font-bold uppercase tracking-widest text-sm text-[#233D37]">
                        <PlusCircle size={18} /> 
                        {prestataireType === 'traiteur' ? 'Nouveau Formule' : 'Nouveau Salle'}
                    </div>
                    
                    {/* استدعاء فورم الإضافة */}
                    {prestataireType === 'traiteur' ? (
                        <AddFormuleForm 
                            prestataireId={prestataireId} 
                            onSuccess={() => setSubView('list')} 
                        />
                    ) : (
                        <AddSalleForm 
                            prestataireId={prestataireId} 
                            onSuccess={() => setSubView('list')} 
                        />
                    )}

                    <button 
                        onClick={() => setSubView('list')} 
                        className="w-full mt-4 bg-[#233D37] text-[#F9F7F2] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl border border-[#233D37] hover:bg-[#1E352F] transition-all shadow"
                    >
                        Anuller et retourner
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;