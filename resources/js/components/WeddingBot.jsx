import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Minus } from 'lucide-react';
import axios from 'axios';

export default function WeddingBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Bienvenue ! 🌸 Je suis WeddingBot, votre assistant virtuel. Comment puis-je vous aider aujourd'hui dans l'organisation de votre mariage (budget, traiteur, salle, negafa) ?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // النزول التلقائي لأسفل الشات عند تلقي رسالة جديدة
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        // 1. إضافة رسالة المستخدم للواجهة
        setMessages(prev => [...prev, { id: Date.now(), text: userMessage, isBot: false }]);
        setIsLoading(true);

        try {
            // 2. إرسال الطلب للباكند الحقيقي
            const response = await axios.post('https://wedapp.test/api/ia/chat', { 
                message: userMessage
            });
            
            // 3. إضافة جواب البوت
            setMessages(prev => [...prev, { id: Date.now() + 1, text: response.data.reply, isBot: true }]);
        } catch (error) {
            console.error("Error fetching bot response:", error);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Désolé, un problème est survenu. Veuillez réessayer.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans flex flex-col items-end">
            
            {/* أيقونة البوت الدائرية النابضة */}
            {!isOpen && (
                <div className="relative">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-40 animate-ping"></span>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="relative bg-[#D4AF37] text-[#0A2A22] h-14 w-14 rounded-full shadow-2xl flex items-center justify-center border-none cursor-pointer"
                    >
                        <Bot size={26} />
                    </motion.button>
                </div>
            )}

            {/* نافذة المحادثة */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="w-[380px] h-[520px] bg-[#F9F7F2] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden mb-2 border border-stone-200/80"
                    >
                        {/* Header */}
                        <div className="bg-[#0A2A22] p-4 px-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Bot size={18} className="text-[#D4AF37]" />
                                <span className="font-serif font-black text-xs tracking-widest uppercase text-[#D4AF37]">Wedding Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer">
                                <Minus size={18} />
                            </button>
                        </div>

                        {/* صندوق الرسائل */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-#F9F7F2] flex flex-col">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
                                    <div className={`p-1.5 rounded-full h-7 w-7 flex items-center justify-center shrink-0 shadow-sm ${msg.isBot ? 'bg-[#D4AF37] text-[#0A2A22]' : 'bg-[#F9F7F2] text-white'}`}>
                                        {msg.isBot ? <Bot size={14} /> : <User size={14} />}
                                    </div>
                                    <div className={`p-3 px-4 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.isBot ? 'bg-white text-stone-800 rounded-tl-none border border-stone-150' : 'bg-[#D4AF37] text-white rounded-tr-none'} text-left whitespace-pre-line`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            
                            {/* مؤشر التفكير */}
                            {isLoading && (
                                <div className="flex gap-2 self-start items-center text-stone-400 text-[10px] uppercase tracking-widest font-bold pl-2">
                                    <Loader2 size={12} className="animate-spin text-[#D4AF37]" />
                                    <span>L'assistant réfléchit...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* نموذج الإدخال */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex gap-2 items-center">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Posez votre question ici..."
                                className="flex-1 p-2.5 px-4 bg-stone-50 text-stone-800 rounded-xl outline-none border border-stone-200 text-xs font-medium placeholder-stone-400 text-left"
                            />
                            <button type="submit" className="p-2.5 bg-[#D4AF37] text-[#0A2A22] rounded-xl border-none cursor-pointer flex items-center justify-center">
                                <Send size={14} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}