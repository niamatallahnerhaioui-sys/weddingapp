import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PrestataireDevis() {
    const [devisList, setDevisList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDevis();
    }, []);

    const fetchDevis = async () => {
        try {
            // كنجيبو غير الـ devis الخاصة بهاد الـ prestataire
            const res = await axios.get(`/api/prestataire/devis?prestataire_id=${localStorage.getItem('prestataire_id')}`);
            setDevisList(res.data);
        } catch (err) {
            console.error("Erreur fetch devis", err);
        } {
            setLoading(false);
        }
    };

    const handleAction = async (id, newStatus) => {
        try {
            await axios.put(`/api/devis/${id}`, { statut: newStatus });
            alert(`Demande ${newStatus === 'accepte' ? 'acceptée' : 'refusée'} avec succès !`);
            fetchDevis(); // إعادة تحديث القائمة
        } catch (err) {
            alert("Erreur lors de la modification");
        }
    };

    if (loading) return <div className="p-6 text-center">Chargement des demandes...</div>;

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-6 border-b pb-3">Demandes de Devis Reçues</h3>
            {devisList.length === 0 ? (
                <p className="text-gray-400 italic">Aucune demande pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {devisList.map((devis) => (
                        <div key={devis.id} className="p-5 border rounded-2xl flex justify-between items-center bg-gray-50">
                            <div>
                                <h4 className="font-bold text-gray-700">Couple ID: #{devis.user_id}</h4>
                                <p className="text-sm text-gray-500">Date Événement: {devis.date_evenement}</p>
                                <p className="text-sm text-gray-500">Invités: {devis.nb_invites} personnes</p>
                                <p className="text-gray-600 mt-2 italic">" {devis.message} "</p>
                                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mt-2 ${devis.statut === 'accepte' ? 'bg-green-100 text-green-700' : devis.statut === 'refuse' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {devis.statut}
                                </span>
                            </div>
                            {devis.statut === 'en_attente' && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleAction(devis.id, 'accepte')} className="bg-[#047857] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition">Accepter</button>
                                    <button onClick={() => handleAction(devis.id, 'refuse')} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition">Refuser</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}