import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Utensils, RefreshCw, Eye, Percent, Layers } from 'lucide-react';

const FormuleList = ({ prestataireId }) => {
    const [formules, setFormules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // دالة جلب البيانات من الـ API
    const fetchFormules = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token'); 
            
            const res = await axios.get(`/api/formules?prestataire_id=${prestataireId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            setFormules(Array.isArray(res.data) ? res.data : res.data.formules || []);
        } catch (error) {
            console.error("Erreur fetching formules", error);
            setError("Impossible de charger vos formules pour le moment.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        if (prestataireId) {
            fetchFormules(); 
        } else {
            setLoading(false);
        }
    }, [prestataireId]);

    // دالة الحذف
    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette formule ?")) return;
        
        try {
            const token = localStorage.getItem('token'); 
            const res = await axios.delete(`/api/formules/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (res.status === 200 || res.status === 204) {
                setFormules(prev => prev.filter(f => f.id !== id));
                alert("Formule supprimée avec succès");
            }
        } catch (err) {
            console.error("Erreur suppression:", err);
            alert("Erreur lors de la suppression.");
        }
    };

    // حسابات الـ Total والإحصائيات التحتانية
    const totalFormules = formules.length;
    const avgPrix = totalFormules > 0 
        ? Math.round(formules.reduce((sum, f) => sum + Number(f.prix_par_personne || f.prix_personne || 0), 0) / totalFormules) 
        : 0;

    if (loading) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-3 bg-transparent">
                <RefreshCw className="text-[#233D37] animate-spin" size={28} />
                <p className="text-gray-400 italic text-sm font-medium">Chargement de vos formules...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-12 text-center bg-red-50 text-red-500 rounded-[2rem] p-6 border border-red-100">
                <p className="font-bold text-sm mb-2">{error}</p>
                <button onClick={fetchFormules} className="text-xs bg-white text-red-600 px-4 py-2 rounded-xl shadow-sm border font-semibold hover:bg-red-100 transition">
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-transparent">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200/60 pb-4">
                <div className="h-2 w-2 bg-[#233D37] rounded-full animate-pulse"></div>
                <h3 className="font-bold text-[#233D37] text-sm uppercase tracking-wider">Mes Formules ({totalFormules})</h3>
            </div>

            {/* 🟡 قائمة العناصر على شكل الأسطر المستديرة الفخمة المستوحاة من الصورة الثانية */}
            <div className="space-y-4 max-w-2xl mx-auto">
                {formules.map(formule => {
                    // معالجة اختلاف تسمية حقل الثمن من الـ Backend
                    const prix = formule.prix_par_personne || formule.prix_personne || 0;

                    return (
                        <div 
                            key={formule.id} 
                            className="bg-[#D4B97C] text-[#233D37] rounded-[22px] p-5 flex justify-between items-center shadow-sm border border-[#c4a96c]/50 transition-all hover:scale-[1.01] hover:shadow-md"
                        >
                            <div className="flex flex-col text-left max-w-[70%]">
                                <span className="font-bold text-base uppercase tracking-wider truncate">
                                    {formule.nom || 'Sans nom'}
                                </span>
                                <span className="text-xs text-[#544625] font-semibold mt-1 flex items-center gap-1">
                                    <Utensils size={12}/>
                                    {prix} DH / Personne
                                </span>
                                {formule.description && (
                                    <p className="text-[11px] text-[#544625]/80 mt-1 line-clamp-1 italic">
                                        {formule.description}
                                    </p>
                                )}
                            </div>

                            {/* الأزرار الدائرية الجانبية الموحدة */}
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handleDelete(formule.id)}
                                    className="w-8 h-8 rounded-full border border-[#233D37] flex items-center justify-center text-[#233D37] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                                    title="Supprimer"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <button 
                                    className="w-8 h-8 rounded-full border border-[#233D37] flex items-center justify-center text-[#233D37] hover:bg-[#233D37] hover:text-[#D4B97C] transition-all"
                                    title="Voir Détails"
                                >
                                    <Eye size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {formules.length === 0 && (
                    <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 bg-white rounded-[24px] italic text-xs">
                        Aucune formule trouvée. Commencez par en ajouter une !
                    </div>
                )}
            </div>

            {/* 🟢 كارت الإحصائيات التحتانية (Total...) مخدومة بديزاين احترافي متناسق */}
            {formules.length > 0 && (
                <div className="mt-10 max-w-2xl mx-auto bg-[#233D37] text-[#F9F7F2] rounded-[2.5rem] p-6 shadow-xl border border-[#1E352F]">
                    <div className="grid grid-cols-2 gap-6 text-center division-x border-gray-700">
                        
                        {/* إجمالي الفرميلات */}
                        <div className="flex flex-col items-center justify-center space-y-1">
                            <div className="p-2 bg-[#1E352F] rounded-full text-[#D4B97C] mb-1">
                                <Layers size={16} />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Total Formules</span>
                            <span className="text-2xl font-black text-[#D4B97C]">{totalFormules}</span>
                        </div>

                        {/* متوسط الثمن */}
                        <div className="flex flex-col items-center justify-center space-y-1 border-l border-gray-600/40">
                            <div className="p-2 bg-[#1E352F] rounded-full text-[#D4B97C] mb-1">
                                <Percent size={16} />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Prix Moyen</span>
                            <span className="text-2xl font-black text-[#D4B97C]">{avgPrix} <span className="text-xs font-medium">DH</span></span>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default FormuleList;