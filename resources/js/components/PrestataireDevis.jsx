// resources/js/components/PrestataireDevis.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, Phone, Mail, Clock, Check, X } from 'lucide-react';

const PrestataireDevis = ({ prestataireId }) => {
    const [devisList, setDevisList] = useState([]);
    const [loading, setLoading] = useState(true);

    // جلب طلبات الـ Devis الخاصة بهاد الممون
    useEffect(() => {
        const fetchDevis = async () => {
            try {
                // تأكد من الـ Route عندك ف Laravel واش هو هادا
                const res = await axios.get(`/api/prestataires/${prestataireId}/devis`);
                setDevisList(res.data);
            } catch (error) {
                console.error("Erreur lors du chargement des devis", error);
            } finally {
                setLoading(true); // خليها false ملي تربطها مع الباك بنجاح
                setLoading(false);
            }
        };

        if (prestataireId) {
            fetchDevis();
        }
    }, [prestataireId]);

    // دالة لتحديث حالة الـ Devis (قبول أو رفض)
    const handleStatusUpdate = async (devisId, newStatus) => {
        try {
            await axios.put(`/api/devis/${devisId}/status`, { status: newStatus });
            // تحديث الواجهة مباشرة بعد التغيير ف السيرفر
            setDevisList(devisList.map(d => d.id === devisId ? { ...d, status: newStatus } : d));
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut", error);
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Chargement des demandes...</div>;
    }

    return (
        <div>
            <header className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Demandes de Devis</h2>
                <p className="text-gray-500">Gérez les demandes de devis reçues de la part des couples</p>
            </header>

            <div className="space-y-6">
                {devisList.length > 0 ? devisList.map((devis) => (
                    <div key={devis.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                        
                        {/* معلومات الكوبل والطلب */}
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    devis.status === 'accepté' ? 'bg-emerald-100 text-emerald-700' :
                                    devis.status === 'refusé' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {devis.status || 'En attente'}
                                </span>
                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                    <Clock size={12}/> {new Date(devis.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <User size={18} className="text-[#047857]" /> {devis.couple_nom || "Nom du Couple"}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                <p className="flex items-center gap-2"><Calendar size={14}/> Date de l'événement: <strong className="text-gray-800">{devis.date_evenement}</strong></p>
                                <p className="flex items-center gap-2"><User size={14}/> Nombre d'invités: <strong className="text-gray-800">{devis.nombre_invites}</strong></p>
                                {devis.couple_telephone && <p className="flex items-center gap-2"><Phone size={14}/> {devis.couple_telephone}</p>}
                                {devis.couple_email && <p className="flex items-center gap-2"><Mail size={14}/> {devis.couple_email}</p>}
                            </div>

                            {devis.remarques && (
                                <div className="bg-gray-50 p-3 rounded-xl text-sm italic text-gray-600 mt-2 border-l-4 border-emerald-500">
                                    "{devis.remarques}"
                                </div>
                            )}
                        </div>

                        {/* أزرار التحكم (القبول والرفض) */}
                        {devis.status === 'pending' || !devis.status ? (
                            <div className="flex sm:flex-col justify-end gap-2 self-center w-full md:w-auto">
                                <button 
                                    onClick={() => handleStatusUpdate(devis.id, 'accepté')}
                                    className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
                                >
                                    <Check size={16}/> Accepter
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(devis.id, 'refusé')}
                                    className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition"
                                >
                                    <X size={16}/> Refuser
                                </button>
                            </div>
                        ) : (
                            <div className="text-sm font-medium text-gray-400 self-center">
                                Traité
                            </div>
                        )}

                    </div>
                )) : (
                    <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-3xl bg-white">
                        Aucune demande de devis reçue pour le moment.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrestataireDevis;