import React, { useState } from 'react';
import { Users, Upload } from 'lucide-react';
import axios from 'axios';

export default function AddSalleForm({ onBack, onSuccess }) { // حيدنا prestataireId حيت مبقاش محتاجينو هنا
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
        
        // إضافة باقي الحقول تلقائياً
        Object.keys(salleData).forEach(key => {
            if (salleData[key] !== '') {
                data.append(key, salleData[key]);
            }
        });
        
        if (photo) {
            data.append('photo', photo);
        }

        // كنجيبو الـ Token اللي مخزنينو فـ المتصفح
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('/api/salles', data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // صيفطنا الساروت للباكيند
                }
            });

            if (response.status === 201 || response.status === 200) {
                alert("Salle ajoutée avec succès !");
                if (onSuccess) onSuccess(response.data);
                if (onBack) onBack();
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.log("Validation Errors:", error.response.data.errors);
                alert("Erreur de validation: " + Object.values(error.response.data.errors).flat().join('\n'));
            } else if (error.response && error.response.status === 401) {
                alert("Votre session a expiré. Veuillez vous reconnecter.");
            } else {
                console.error("Server Error:", error.response?.data);
                alert("Erreur: " + (error.response?.data?.error || "Problème de connexion au serveur."));
            }
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white rounded-[2rem]">
            <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-[#047857]">Détails de la Salle</h2>
                <p className="text-gray-400">Configurez votre espace d'exception.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de la salle</label>
                    <input name="nom" onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-[#D4AF37] outline-none" required />
                </div>

                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                    <input name="ville" onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none" required />
                </div>
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                    <input name="adresse" onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none" required />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Capacité Min</label>
                    <input name="capacite_min" type="number" onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Capacité Max</label>
                    <input name="capacite_max" type="number" onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none" required />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Prix Journée (DH)</label>
                    <input name="prix_journee" type="number" onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Prix Soirée (DH)</label>
                    <input name="prix_soiree" type="number" onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none" required />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Photo</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center bg-gray-50 relative">
                        <Upload className="text-gray-400 mb-2" size={32} />
                        <span className="text-sm text-gray-500">{photo ? photo.name : "Upload photo"}</span>
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                </div>

                <button type="submit" className="md:col-span-2 bg-[#047857] text-white py-5 rounded-2xl font-bold shadow-lg hover:bg-[#035e44] transition-all">
                    Enregistrer la Salle
                </button>
            </form>
        </div>
    );
}