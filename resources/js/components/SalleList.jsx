import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, MapPin, Home, RefreshCw } from 'lucide-react';

const SalleList = ({ prestataireId }) => {
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // دالة جلب البيانات
    const fetchSalles = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token'); 
            
            console.log("الـ Token المستعمل هو: ", token);

            const res = await axios.get(`/api/salles?prestataire_id=${prestataireId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            // التأكد من أن الـ data مصفوفة قبل وضعها فـ الـ state
            setSalles(Array.isArray(res.data) ? res.data : res.data.salles || []);
        } catch (error) {
            console.error("Erreur fetching salles", error);
            setError("Impossible de charger vos salles pour le moment.");
        } finally {
            setLoading(false);
        }
    };

    // تشغيل الدالة عند تغيير الـ prestataireId
    useEffect(() => { 
        if (prestataireId) {
            fetchSalles(); 
        } else {
            setLoading(false);
        }
    }, [prestataireId]);

    // دالة حذف قاعة
    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette salle ?")) return;
        
        try {
            const token = localStorage.getItem('token'); 

            const res = await axios.delete(`/api/salles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (res.status === 200 || res.status === 204) {
                setSalles(prev => prev.filter(s => s.id !== id));
                alert("Salle supprimée avec succès");
            }
        } catch (err) {
            console.error("Full Error:", err.response);
            alert("Erreur lors de la suppression: " + (err.response?.data?.message || "Erreur serveur"));
        }
    };

    // 1. حالة التحميل (Loading) مع الحفاظ على الهيكل العام
    if (loading) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="text-[#047857] animate-spin" size={28} />
                <p className="text-gray-400 italic text-sm font-medium">Chargement de vos salles...</p>
            </div>
        );
    }

    // 2. حالة وقوع خطأ فـ الـ API
    if (error) {
        return (
            <div className="w-full py-12 text-center bg-red-50 text-red-500 rounded-[2rem] p-6 border border-red-100">
                <p className="font-bold text-sm mb-2">{error}</p>
                <button onClick={fetchSalles} className="text-xs bg-white text-red-600 px-4 py-2 rounded-xl shadow-sm border font-semibold hover:bg-red-100 transition">
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="h-2 w-2 bg-[#047857] rounded-full animate-pulse"></div>
                <h3 className="font-bold text-gray-700 text-sm">Mes Salles ({salles.length})</h3>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {salles.map(salle => (
                    <div key={salle.id} className="relative group">
                        <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-4 h-full justify-between">
                            
                            {/* الصورة أو الأيقونة الافتراضية */}
                            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-emerald-50 flex items-center justify-center border border-emerald-100 relative group-hover:border-emerald-200 transition-colors">
                                {salle.photo ? (
                                    <img 
                                        src={`/storage/${salle.photo}`} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        alt={salle.nom}
                                        // حماية في حالة كانت الصورة معطوبة فـ السيرفر
                                        onError={(e) => { e.target.style.display = 'none'; }} 
                                    />
                                ) : (
                                    <Home size={32} className="text-[#047857] opacity-20"/>
                                )}
                            </div>

                            {/* معلومات القاعة مع استعمال الـ Optional Chaining */}
                            <div className="w-full text-center space-y-1">
                                <h4 className="font-bold text-gray-800 text-xs truncate">{salle.nom || 'Sans nom'}</h4>
                                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1 font-medium truncate">
                                    <MapPin size={10} className="text-[#D4AF37] flex-shrink-0"/> {salle.ville || 'Marrakech'}
                                </p>
                            </div>

                            {/* الثمن */}
                            <div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 mt-auto">
                                <span className="text-[11px] font-black text-[#047857] tracking-tight">
                                    {salle.prix_journee ? `${salle.prix_journee} DH` : 'Prix non spécifié'}
                                </span>
                            </div>
                        </div>

                        {/* زر الحذف الفلوتينغ */}
                        <button 
                            onClick={() => handleDelete(salle.id)}
                            className="absolute -top-2 -right-2 p-2 bg-white text-red-500 rounded-full shadow-lg border border-red-50 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 z-10"
                        >
                            <Trash2 size={12}/>
                        </button>
                    </div>
                ))}

                {/* واجهة فارغة فـ حالة عدم وجود أي قاعة */}
                {salles.length === 0 && (
                    <div className="col-span-full text-center py-16 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400 text-xs italic">
                        Aucune salle trouvée. Commencez par en ajouter une !
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalleList;