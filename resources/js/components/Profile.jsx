import React from 'react';
import { User, Mail, MapPin, Phone, Tag, ShieldCheck } from 'lucide-react';

const Profile = ({ user }) => {
    const prestataire = user?.prestataire || {};

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <header className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-gray-800 italic">Mon Profil</h2>
                <p className="text-gray-400 font-medium">Gérez vos informations personnelles et professionnelles.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* بطاقة المعلومات الشخصية */}
                <div className="md:col-span-1 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-[#047857] mb-4 border border-emerald-100">
                        <User size={40} />
                    </div>
                    <h3 className="font-bold text-xl text-gray-800">{user?.prenom} {user?.nom}</h3>
                    <span className="text-[10px] bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest text-gray-500 font-bold mt-2">
                        {user?.role}
                    </span>
                </div>

                {/* بطاقة تفاصيل الحساب */}
                <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                                <Mail size={10}/> Email
                            </p>
                            <p className="text-gray-700 font-medium">{user?.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                                <MapPin size={10}/> Ville
                            </p>
                            <p className="text-gray-700 font-medium">{user?.ville}</p>
                        </div>
                        
                        {user?.role === 'prestataire' && (
                            <>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                                        <Tag size={10}/> Nom Commercial
                                    </p>
                                    <p className="text-gray-700 font-medium">{prestataire.nom || 'Non défini'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                                        <Phone size={10}/> Téléphone
                                    </p>
                                    <p className="text-gray-700 font-medium">{prestataire.telephone || 'Non défini'}</p>
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                                        <ShieldCheck size={10}/> Statut de Vérification
                                    </p>
                                    <p className={`text-sm font-bold ${prestataire.statut_verifi ? 'text-green-500' : 'text-amber-500'}`}>
                                        {prestataire.statut_verifi ? 'Compte Vérifié' : 'En attente de vérification'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;