// resources/js/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, LogOut, PlusCircle, MapPin, Utensils, Home } from 'lucide-react';

const Dashboard = ({ user, onLogout, onAddAction }) => {
    console.log("User Data in Dashboard:", user);
    
    // تأكدي بلي هاد الطريق صحيحة بناءً على شنو طبع ليك الـ console
    const prestataireInfo = user?.prestataire || {};
    const isTraiteur = prestataireInfo.type === 'traiteur';
    const prestataireInfo = user.prestataire || {};
    const isTraiteur = prestataireInfo.type === 'traiteur';
    
    const [items, setItems] = useState([]); // هادي غتهز يا الـ Salles يا الـ Formules

    const fetchData = async () => {
        try {
            // نحدد الـ Endpoint على حساب النوع
            const endpoint = isTraiteur ? '/api/formules' : '/api/salles';
            const res = await axios.get(`${endpoint}?prestataire_id=${user.id}`);
            setItems(res.data);
        } catch (error) {
            console.error("Erreur fetching data", error);
        }
    };

    useEffect(() => { fetchData(); }, [isTraiteur]);

    return (
        <div className="flex min-h-screen bg-[#FAFAFA]">
            {/* Sidebar الجانبي */}
            <aside className="w-64 bg-white border-r p-6 flex flex-col shadow-sm">
                <h2 className="text-xl font-bold text-[#047857] mb-10 italic">Elite Admin</h2>
                
                <nav className="flex-1 space-y-2">
                    <div className="flex items-center p-3 bg-emerald-50 text-[#047857] rounded-xl font-medium cursor-pointer">
                        <LayoutDashboard className="mr-3" size={20}/> Dashboard
                    </div>
                    
                    {/* أزرار Sidebar تتغير حسب التخصص */}
                    {isTraiteur ? (
                        <div className="flex items-center p-3 text-gray-500 hover:bg-gray-50 rounded-xl cursor-pointer">
                            <Utensils className="mr-3" size={20}/> Mes Formules
                        </div>
                    ) : (
                        <div className="flex items-center p-3 text-gray-500 hover:bg-gray-50 rounded-xl cursor-pointer">
                            <Home className="mr-3" size={20}/> Mes Salles
                        </div>
                    )}
                </nav>

                <button onClick={onLogout} className="flex items-center p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut className="mr-3" size={20}/> Déconnexion
                </button>
            </aside>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            {isTraiteur ? "Gestion des Formules" : "Mes Salles"}
                        </h2>
                        <p className="text-gray-500">Bienvenue, {prestataireInfo.nom || user.nom}</p>
                    </div>

                    <button 
                        onClick={() => onAddAction(isTraiteur ? 'formule' : 'salle')} 
                        className="bg-[#D4AF37] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#b8962d] transition-all shadow-md"
                    >
                        <PlusCircle size={20}/> 
                        {isTraiteur ? "Ajouter une formule" : "Ajouter une salle"}
                    </button>
                </div>

                {/* عرض البيانات (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.length > 0 ? items.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 bg-gray-100 relative">
                                {item.photo ? (
                                    <img src={`/storage/${item.photo}`} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300">
                                        {isTraiteur ? <Utensils size={40}/> : <Home size={40}/>}
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-800">{item.nom}</h3>
                                {!isTraiteur && (
                                    <p className="text-gray-400 flex items-center text-sm mt-1">
                                        <MapPin size={14} className="mr-1"/> {item.ville}
                                    </p>
                                )}
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-[#047857] font-bold text-xl">
                                        {isTraiteur ? `${item.prix_personne} DH / Pers` : `${item.prix_journee} DH`}
                                    </span>
                                    <button className="text-sm text-gray-400 hover:text-[#D4AF37]">Modifier</button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-gray-400 border-2 border-dashed rounded-3xl">
                            Aucun élément trouvé. Commencez par en ajouter un !
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;