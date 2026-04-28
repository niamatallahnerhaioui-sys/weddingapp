import React, { useState } from 'react';
import axios from 'axios';
import { Upload, MapPin, Users, DollarSign } from 'lucide-react';

const AddSalleForm = ({ prestataireId }) => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        nom_salle: '', ville: '', adresse: '', 
        capacite: '', prix_par_jour: '', description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('photo', file);
        data.append('prestataire_id', prestataireId);

        try {
            await axios.post('/api/salles', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Salle ajoutée avec succès !");
        } catch (error) { alert("Erreur d'ajout"); }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter une nouvelle Salle</h2>
            
            <input name="nom_salle" placeholder="Nom de la salle" onChange={e => setFormData({...formData, nom_salle: e.target.value})} className="w-full p-3 border rounded-xl" required />
            
            <div className="grid grid-cols-2 gap-4">
                <div className="relative"><MapPin className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input name="ville" placeholder="Ville" onChange={e => setFormData({...formData, ville: e.target.value})} className="w-full pl-10 p-3 border rounded-xl" required />
                </div>
                <div className="relative"><Users className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input name="capacite" type="number" placeholder="Capacité" onChange={e => setFormData({...formData, capacite: e.target.value})} className="w-full pl-10 p-3 border rounded-xl" required />
                </div>
            </div>

            <div className="relative"><DollarSign className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input name="prix_par_jour" type="number" placeholder="Prix par jour (DH)" onChange={e => setFormData({...formData, prix_par_jour: e.target.value})} className="w-full pl-10 p-3 border rounded-xl" required />
            </div>

            <textarea name="description" placeholder="Description de la salle..." onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-xl h-32"></textarea>

            <div className="border-2 border-dashed border-pink-200 p-6 rounded-xl text-center">
                <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" id="photo-upload" />
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="text-pink-500 mb-2" />
                    <span className="text-sm text-gray-500">{file ? file.name : "Télécharger la photo principale"}</span>
                </label>
            </div>

            <button type="submit" className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-pink-600">
                Publier la salle
            </button>
        </form>
    );
};

export default AddSalleForm;