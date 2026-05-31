import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DemandeDevisForm({ prestataireId }) {
    const [formData, setFormData] = useState({
        date_evenement: '',
        nb_invites: '',
        message: ''
    });
    const [bookedDates, setBookedDates] = useState([]);
    const [loading, setLoading] = useState(false);

    // جلب التواريخ المحجوزة
    useEffect(() => {
        if (prestataireId) {
            axios.get(`http://localhost:8000/api/prestataires/${prestataireId}/disponibilites`)
                .then(res => {
                    const unavailable = res.data
                        .filter(item => item.statut !== 'libre')
                        .map(item => item.date_bloquee || item.date);
                    setBookedDates(unavailable);
                })
                .catch(err => console.error(err));
        }
    }, [prestataireId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (bookedDates.includes(formData.date_evenement)) {
            alert("Désolé, ce prestataire est déjà occupé ou bloqué à cette date. Veuillez choisir une autre date.");
            return;
        }

        setLoading(true);
        try {
            // جبدنا الـ token المحفوظ ف المتصفح من بعد الـ login
            const token = localStorage.getItem('token'); 

            await axios.post('http://localhost:8000/api/devis', {
                prestataire_id: prestataireId,
                date_evenement: formData.date_evenement,
                nb_invites: parseInt(formData.nb_invites),
                message: formData.message
            }, {
                // إرسال الـ Token ف الـ Headers باش يقبلو الـ Backend
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert("Votre demande de devis a été envoyée avec succès !");
            setFormData({ date_evenement: '', nb_invites: '', message: '' });
        } catch (error) {
            console.error(error.response?.data);
            alert(error.response?.data?.message || "Erreur lors de l'envoi de la demande.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 border border-[#0A2A22]/10 shadow-sm text-[#0A2A22] font-sans">
            <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-6 text-center">Demander un Devis</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {/* تاريخ الحدث */}
                <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Date de l'événement</label>
                    <input 
                        type="date"
                        required
                        value={formData.date_evenement}
                        onChange={e => setFormData({...formData, date_evenement: e.target.value})}
                        className="w-full h-[46px] px-5 bg-[#E1C482]/20 border border-transparent rounded-none text-[14px] outline-none font-semibold transition-colors focus:border-[#0A2A22]" 
                    />
                    {bookedDates.includes(formData.date_evenement) && (
                        <p className="text-red-600 text-[11px] font-bold mt-1">⚠️ Ce jour est indisponible chez ce prestataire.</p>
                    )}
                </div>

                {/* عدد الضيوف */}
                <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Nombre d'invités</label>
                    <input 
                        type="number"
                        placeholder="EX: 200"
                        min="1"
                        required
                        value={formData.nb_invites}
                        onChange={e => setFormData({...formData, nb_invites: e.target.value})}
                        className="w-full h-[46px] px-5 bg-[#E1C482]/20 border border-transparent rounded-none text-[14px] outline-none font-semibold transition-colors focus:border-[#0A2A22]" 
                    />
                </div>

                {/* رسالة الطلب */}
                <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Message / Détails spécifiques</label>
                    <textarea 
                        placeholder="DÉTAILLEZ VOTRE DEMANDE (EX: PACK SOUHAITÉ, SERVICES COMPLÉMENTAIRES...)"
                        rows="4"
                        required
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        className="w-full p-5 bg-[#E1C482]/20 border border-transparent rounded-none text-[14px] outline-none font-semibold transition-colors focus:border-[#0A2A22] resize-none"
                    ></textarea>
                </div>

                {/* زر الإرسال */}
                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0A2A22] text-[#E1C482] h-[52px] text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#123b31] transition-all shadow-md active:scale-[0.99] rounded-none"
                    >
                        {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                    </button>
                </div>
            </form>
        </div>
    );
}