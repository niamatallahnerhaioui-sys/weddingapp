import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Utensils, Users } from 'lucide-react';

const FormuleList = ({ prestataireId }) => {
    const [formules, setFormules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFormules();
    }, []);

    const fetchFormules = async () => {
        try {
            const res = await axios.get(`/api/formules?prestataire_id=${prestataireId}`);
            setFormules(res.data);
        } catch (err) {
            console.error("Erreur fetching formules");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Voulez-vous vraiment supprimer cette formule ?")) {
            await axios.delete(`/api/formules/${id}`);
            setFormules(formules.filter(f => f.id !== id)); // تحديث القائمة في الحين
        }
    };

    if (loading) return <p className="text-center p-10">Chargement de vos formules...</p>;

    return (
        <div className="space-y-6">
            {/* الاحصائيات البسيطة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h3 className="text-gray-400 text-sm mb-1 italic">Total Formules</h3>
                    <p className="text-3xl font-bold text-amber-600">{formules.length}</p>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Mes Formules Créées</h3>
            
            <div className="grid gap-4">
                {formules.map((f) => (
                    <div key={f.id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Utensils size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">{f.nom}</h4>
                                <p className="text-gray-500 text-sm line-clamp-1">{f.description}</p>
                                <div className="flex gap-4 mt-1 text-xs font-semibold text-amber-700">
                                    <span>{f.prix_par_personne} DH / Personne</span>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => handleDelete(f.id)}
                            className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                {formules.length === 0 && (
                    <div className="text-center p-10 bg-gray-50 rounded-[2rem] border border-dashed">
                        <p className="text-gray-400">Vous n'avez pas encore de formules. Commencez par en ajouter une !</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormuleList;