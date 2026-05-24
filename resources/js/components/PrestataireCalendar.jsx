import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PrestataireCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    // 1. الـ State عبارة عن Object باش نقدرو نحدثوه ونقراو منو ف البلاصة بـ الـ Key ديال التاريخ
    const [bookedDates, setBookedDates] = useState({}); 
    const [selectedDate, setSelectedDate] = useState(null);
    const [status, setStatus] = useState('libre');
    const [loading, setLoading] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        fetchDisponibilites();
    }, [currentDate]);

    // 🛠️ دالة لتوحيد تنسيق التاريخ (مثال: 2026-05-21) باش نضمنوا مية ف المية تطابق الـ Keys
    const formatDateStandard = (dateInput) => {
        if (!dateInput) return '';
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return dateInput; 
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const fetchDisponibilites = async () => {
        const token = localStorage.getItem('token'); 
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        };

        try {
            const userRes = await axios.get('/api/user', config);
            const userId = userRes.data.id;
            
            const res = await axios.get(`/api/disponibilites/prestataire/${userId}`, config);
            
            const mapped = {};
            // تحويل الـ Array اللي جاي من Laravel لـ Object كيسهل قراءته وتحديثه ف البلاصة
            if (Array.isArray(res.data)) {
                res.data.forEach(item => {
                    if (item.date_bloquee) {
                        const cleanKey = formatDateStandard(item.date_bloquee);
                        // تنظيف وتوحيد الكلمة (حروف صغيرة وبلا فراغات وبلا أكسون)
                        let cleanStatus = String(item.statut).toLowerCase().trim();
                        if (cleanStatus.includes('bloqu') || cleanStatus.includes('occup')) cleanStatus = 'bloque';
                        if (cleanStatus.includes('reserv')) cleanStatus = 'reserve';
                        
                        mapped[cleanKey] = cleanStatus;
                    }
                });
            }
            setBookedDates(mapped);
        } catch (error) {
            console.error("Erreur lors du chargement des disponibilités", error.response?.data || error);
        }
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const monthsNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    const handleDateClick = (day) => {
        const dateStr = formatDateStandard(new Date(year, month, day));
        setSelectedDate(dateStr);
        setStatus(bookedDates[dateStr] || 'libre');
    };

    const handleSaveStatus = async () => {
        if (!selectedDate) return;
        
        setLoading(true);
        const token = localStorage.getItem('token'); 
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        };

        try {
            // توحيد الـ statut اللي غايمشي للباكاند
            let cleanStatusToSend = status.toLowerCase().trim();

            const payload = {
                date_bloquee: selectedDate,      
                statut: cleanStatusToSend
            };

            await axios.post('/api/disponibilites', payload, config);
            
            // 🔥 هنا السحر: التحديث الفوري المضمون ف الـ State كـ Object
            setBookedDates(prev => {
                const newDates = { ...prev };
                newDates[selectedDate] = cleanStatusToSend;
                return newDates;
            });

            alert("Disponibilité mise à jour !");
            setSelectedDate(null); // نسدو الفورم مورا النجاح
        } catch (error) {
            console.error("Erreur save:", error.response?.data);
            alert("Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-[#F9F7F2] text-[#0A2A22] font-sans rounded-[2rem] shadow-xl">
            <h2 className="text-3xl font-serif font-bold italic mb-8 text-center text-[#047857]">Gestion des Disponibilités</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 bg-white p-8 rounded-[1.5rem] border border-[#0A2A22]/10 shadow-sm relative">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="text-sm font-bold p-3 hover:bg-stone-100 rounded-full transition-colors">Préc.</button>
                        <h3 className="font-bold uppercase tracking-widest text-lg font-serif italic text-stone-800">{monthsNames[month]} {year}</h3>
                        <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="text-sm font-bold p-3 hover:bg-stone-100 rounded-full transition-colors">Suiv.</button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-black tracking-widest text-stone-400 uppercase mb-4">
                        <div>Dim</div><div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div>
                    </div>

                    <div className="grid grid-cols-7 gap-3">
                        {Array(firstDayIndex).fill(null).map((_, i) => <div key={`empty-${i}`} className="w-12 h-12"></div>)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = formatDateStandard(new Date(year, month, day));
                            
                            // قراءة الحالة مباشرة من الـ Object الموحد
                            const currentStatus = bookedDates[dateStr] || 'libre';

                            // 🎨 تحديد فئات الألوان القوية (قمت بتغييرها لـ خلفيات فاقعة باش تبان ليك ف البلاصة)
                            let bgClass = "bg-stone-50 text-[#0A2A22] border-stone-200 hover:border-[#0A2A22]/40";
                            
                            if (currentStatus === 'bloque') {
                                bgClass = "bg-red-500 text-white border-red-600 font-bold shadow-md hover:bg-red-600";
                            } else if (currentStatus === 'reserve') {
                                bgClass = "bg-amber-500 text-white border-amber-600 font-bold shadow-md hover:bg-amber-600";
                            } else if (currentStatus === 'libre') {
                                bgClass = "bg-emerald-500 text-white border-emerald-600 font-bold shadow-md hover:bg-emerald-600";
                            }

                            return (
                                <button 
                                    key={day}
                                    onClick={() => handleDateClick(day)}
                                    className={`w-12 h-12 text-xs font-semibold border transition-all rounded-full flex items-center justify-center ${bgClass} ${selectedDate === dateStr ? 'ring-4 ring-offset-2 ring-[#0A2A22] scale-110 shadow-xl z-10' : ''}`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="flex gap-6 mt-8 pt-6 border-t border-gray-100 justify-center text-[11px] uppercase tracking-widest font-black text-stone-500">
                        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 bg-emerald-500 rounded-full"></span> Libre</div>
                        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 bg-red-500 rounded-full"></span> Bloqué</div>
                        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 bg-amber-500 rounded-full"></span> Réservé</div>
                    </div>
                </div>

                <div className="bg-white p-8 border border-[#0A2A22]/10 shadow-sm flex flex-col justify-between rounded-[1.5rem]">
                    {selectedDate ? (
                        <div className="space-y-6">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">Modifier la Date:</h4>
                            <p className="text-xl font-bold font-serif italic text-[#0A2A22] bg-[#F9F7F2] p-4 rounded-xl text-center border border-stone-200 shadow-inner">{selectedDate}</p>
                            
                            <div className="flex flex-col space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Statut</label>
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full h-[50px] px-4 bg-white border border-[#0A2A22]/20 rounded-xl text-xs font-bold outline-none uppercase cursor-pointer focus:border-[#0A2A22] transition-colors"
                                >
                                    <option value="libre">Libre (Disponible)</option>
                                    <option value="bloque">Bloqué (Occupé)</option>
                                    <option value="reserve">Réservé (Client)</option>
                                </select>
                            </div>

                            <button 
                                onClick={handleSaveStatus}
                                disabled={loading}
                                className="w-full bg-[#0A2A22] text-[#E1C482] h-[50px] text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-[#123b31] transition-all disabled:bg-stone-300 shadow-md"
                            >
                                {loading ? 'Enregistrement...' : 'Mettre à jour'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center my-auto text-stone-400 text-xs py-10 italic">
                            Sélectionnez une date pour modifier son statut.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}