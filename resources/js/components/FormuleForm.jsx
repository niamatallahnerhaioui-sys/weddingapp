import { useState } from 'react';
import axios from 'axios';
import { Utensils, DollarSign, Users, FileText, CheckCircle } from 'lucide-react';

const AddFormuleForm = ({ prestataireId }) => {
   const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix_par_personne: '',
    prestataire_id: prestataireId
})
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // تأكدي من إنشاء هاد الـ Route في api.php ديال Laravel
            await axios.post('/api/formules', formData);
            setMessage({ type: 'success', text: 'La formule a été ajoutée avec succès !' });
            setFormData({ nom: '', description: '', prix_par_personne: '', min_personnes: '', prestataire_id: prestataireId });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de l’ajout. Veuillez réessayer.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                    <Utensils size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Nouvelle Formule</h2>
                    <p className="text-gray-500 text-sm">Créez un menu personnalisé pour vos clients</p>
                </div>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <CheckCircle size={18} />
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Nom de la Formule</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            required
                            placeholder="Ex: Menu Prestige"
                            className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition"
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                            value={formData.nom}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Prix par Personne (DH)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            required
                            placeholder="0.00"
                            className="w-full pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition"
                            onChange={(e) => setFormData({...formData, prix_par_personne: e.target.value})}
                            value={formData.prix_par_personne}
                        />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Description du Menu</label>
                    <textarea 
                        rows="4"
                        required
                        placeholder="Détaillez les plats, entrées, et desserts..."
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition"
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        value={formData.description}
                    ></textarea>
                </div>


                <div className="md:col-span-2 mt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'En cours...' : 'Publier la formule'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFormuleForm;