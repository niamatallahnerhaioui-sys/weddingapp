import { useState, useEffect } from 'react';
import axios from 'axios'; //  هادي هي الصحيحة ✅
import { Trash2, Utensils, RefreshCw } from 'lucide-react';

const FormuleList = ({ prestataireId }) => {
    const [formules, setFormules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (prestataireId) {
            fetchFormules();
        }
    }, [prestataireId]);

    const fetchFormules = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/formules?prestataire_id=${prestataireId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setFormules(res.data);
        } catch (err) {
            console.error("Erreur fetching formules", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette formule ?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/formules/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFormules(formules.filter(f => f.id !== id));
                alert("Formule supprimée avec succès");
            } catch (err) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    // 🟡 حالة التحميل متناسقة بالكامل
    if (loading) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="text-[#233D37] animate-spin" size={28} />
                <p className="text-gray-500 italic text-sm font-medium">Chargement de vos formules...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* بطاقات الإحصائيات الفخمة باللون الجديد */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1 font-sans">Total Formules</h3>
                    <p className="text-4xl font-black text-[#233D37] font-serif">{formules.length}</p>
                </div>
            </div>

            {/* عنوان القائمة الرئيسي */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
                <div className="h-2 w-2 bg-[#233D37] rounded-full animate-pulse"></div>
                <h3 className="font-bold text-[#233D37] uppercase tracking-wider text-sm font-serif">Mes Formules Créées</h3>
            </div>
            
            {/* قائمة الـ Formules */}
            <div className="grid gap-4">
                {formules.map((f) => (
                    <div key={f.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 flex items-center justify-between hover:shadow-md transition duration-300">
                        <div className="flex items-center gap-4 overflow-hidden">
                            {/* أيقونة فخمة بلون دارك غرين والذهبي */}
                            <div className="p-4 bg-[#F9F7F2] text-[#233D37] border border-gray-100 rounded-2xl flex-shrink-0">
                                <Utensils size={22} />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-[#233D37] text-base uppercase font-serif truncate">{f.nom}</h4>
                                <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{f.description}</p>
                                <div className="flex gap-4 mt-2 text-xs font-bold text-[#D4B97C] bg-[#233D37] px-3 py-1 rounded-full w-max shadow-sm">
                                    <span>{f.prix_par_personne} DH / Personne</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* زر الحذف الأنيق */}
                        <button 
                            onClick={() => handleDelete(f.id)}
                            className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors flex-shrink-0"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {/* واجهة فارغة */}
                {formules.length === 0 && (
                    <div className="text-center py-16 bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-300 text-gray-500 text-sm italic font-serif">
                        Vous n'avez pas encore de formules. Commencez par en ajouter une !
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormuleList;