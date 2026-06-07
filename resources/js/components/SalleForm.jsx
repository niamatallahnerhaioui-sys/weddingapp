import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';

export default function AddSalleForm({ onBack, onSuccess }) {
    const [salleData, setSalleData] = useState({
        nom: '',
        adresse: '',
        ville: '',
        capacite_min: '',
        capacite_max: '',
        prix_journee: '',
        prix_soiree: '',
        description: ''
    });
    const [photo, setPhoto] = useState(null);

    const handleInputChange = (e) => {
        setSalleData({ ...salleData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        Object.keys(salleData).forEach(key => {
            if (salleData[key] !== '') {
                data.append(key, salleData[key]);
            }
        });
        
        if (photo) {
            data.append('photo', photo);
        }

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('/api/salles', data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201 || response.status === 200) {
                alert("Salle ajoutée avec succès !");
                if (onSuccess) onSuccess(response.data);
                if (onBack) onBack();
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                alert("Erreur de validation: " + Object.values(error.response.data.errors).flat().join('\n'));
            } else if (error.response && error.response.status === 401) {
                alert("Votre session a expiré. Veuillez vous reconnecter.");
            } else {
                alert("Erreur: " + (error.response?.data?.error || "Problème de connexion au serveur."));
            }
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 text-center">
                {/* 🟢 العنوان باللون الأخضر الداكن المطلوب */}
                <h2 className="text-xl font-bold text-[#233D37] uppercase tracking-wider">Détails de la Salle</h2>
                <p className="text-gray-600 text-xs mt-1">Configurez votre espace d'exception.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-[#233D37] mb-1">Nom de la salle</label>
                    <input name="nom" onChange={handleInputChange} className="w-full p-3 text-sm border border-transparent rounded-xl bg-white text-gray-800 outline-none shadow-sm" required />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-[#233D37] mb-1">Ville</label>
                    <input name="ville" onChange={handleInputChange} className="w-full p-3 text-sm border border-transparent rounded-xl bg-white text-gray-800 outline-none shadow-sm" required />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-[#233D37] mb-1">Adresse</label>
                    <input name="adresse" onChange={handleInputChange} className="w-full p-3 text-sm border border-transparent rounded-xl bg-white text-gray-800 outline-none shadow-sm" required />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-[#233D37] mb-1">Capacité Min</label>
                    <input name="capacite_min" type="number" onChange={handleInputChange} className="w-full p-3 text-sm border border-transparent rounded-xl bg-white text-gray-800 outline-none shadow-sm" required />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-[#233D37] mb-1">Capacité Max</label>
                    <input name="capacite_max" type="number" onChange={handleInputChange} className="w-full p-3 text-sm border border-transparent rounded-xl bg-white text-gray-800 outline-none shadow-sm" required />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-[#233D37] mb-1">Prix Journée (DH)</label>
                    <input name="prix_journee" type="number" onChange={handleInputChange} className="w-full p-3 text-sm border border-transparent rounded-xl bg-white text-gray-800 outline-none shadow-sm" required />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-[#233D37] mb-1">Prix Soirée (DH)</label>
                    <input name="prix_soiree" type="number" onChange={handleInputChange} className="w-full p-3 text-sm border border-transparent rounded-xl bg-white text-gray-800 outline-none shadow-sm" required />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-[#233D37] mb-1">Description</label>
                    <textarea name="description" rows="2" onChange={handleInputChange} className="w-full p-3 text-sm border border-transparent rounded-xl bg-white text-gray-800 outline-none shadow-sm" required placeholder="Détails supplémentaires..."></textarea>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-[#233D37] mb-1">Photo</label>
                    <div className="border border-dashed border-[#233D37]/30 rounded-xl p-4 flex flex-col items-center bg-white/50 relative">
                        <Upload className="text-[#233D37]/70 mb-1" size={24} />
                        <span className="text-xs text-[#233D37]/80 font-medium">{photo ? photo.name : "Télécharger une photo"}</span>
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                </div>

                {/* 🟢 زر الحفظ بنفس الـ Style الموحد بلون #233D37 */}
                <div className="md:col-span-2 mt-2">
                    <button type="submit" className="w-full bg-[#233D37] text-[#F9F7F2] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl border border-[#233D37] hover:bg-[#1E352F] transition-all shadow">
                        Enregistrer la Salle
                    </button>
                </div>
            </form>
        </div>
    );
}