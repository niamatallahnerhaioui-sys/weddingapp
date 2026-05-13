import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, MapPin, Home, Users } from 'lucide-react';

const SalleList = ({ prestataireId }) => {
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSalles = async () => {
        try {
            const res = await axios.get(`/api/salles?prestataire_id=${prestataireId}`);
            setSalles(res.data);
        } catch (error) {
            console.error("Erreur fetching salles", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        if (prestataireId) {
            fetchSalles(); 
        }
    }, [prestataireId]);

    const handleDelete = async (id) => {
    if(window.confirm("Voulez-vous vraiment supprimer cette salle ?")) {
        try {
            // زدنا await هنا وتأكدنا من الـ URL
            const res = await axios.delete(`/api/salles/${id}`);
            
            if (res.status === 200 || res.status === 204) {
                setSalles(salles.filter(s => s.id !== id));
                alert("Salle supprimée avec succès");
            }
        } catch (err) {
            console.error("Full Error:", err.response); // هادي غاتوريك الخطأ في الـ Console
            alert("Erreur lors de la suppression: " + (err.response?.data?.message || "Erreur serveur"));
        }
    }
};

    if (loading) return <div className="text-center p-10 text-gray-400 italic text-sm">Chargement...</div>;

    return (
        <div className="space-y-6">
            {/* Header بسيط */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="h-2 w-2 bg-[#047857] rounded-full animate-pulse"></div>
                <h3 className="font-bold text-gray-700 text-sm">Mes Salles ({salles.length})</h3>
            </div>

            {/* Grid المربعات الصغيرة (بناءً على تفضيلاتك الأخيرة) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {salles.map(salle => (
                    <div key={salle.id} className="relative group">
                        <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-4">
                            
                            {/* المربع السحري للصورة: Square Aspect Ratio */}
                            {/* استعملنا w-full و aspect-square باش تجي مربعة تلقائياً */}
                            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-emerald-50 flex items-center justify-center border border-emerald-100 relative group-hover:border-emerald-200 transition-colors">
                                {salle.photo ? (
                                    <img 
                                        src={`/storage/${salle.photo}`} 
                                        // object-cover ضرورية باش ما تكمشش الصورة وسط المربع
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        alt={salle.nom}
                                    />
                                ) : (
                                    <Home size={32} className="text-[#047857] opacity-20"/>
                                )}
                            </div>

                            {/* معلومات مختصرة جداً */}
                            <div className="w-full text-center space-y-1">
                                <h4 className="font-bold text-gray-800 text-xs truncate">{salle.nom}</h4>
                                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1 font-medium">
                                    <MapPin size={10} className="text-[#D4AF37]"/> {salle.ville}
                                </p>
                            </div>

                            {/* الثمن */}
                            <div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                                <span className="text-[11px] font-black text-[#047857] tracking-tight">{salle.prix_journee} DH</span>
                            </div>
                        </div>

                        {/* زر المسح يظهر عند تمرير الفأرة */}
                        <button 
                            onClick={() => handleDelete(salle.id)}
                            className="absolute -top-2 -right-2 p-2 bg-white text-red-500 rounded-full shadow-lg border border-red-50 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 z-10"
                        >
                            <Trash2 size={12}/>
                        </button>
                    </div>
                ))}

                {/* حالة ما كاين والو */}
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