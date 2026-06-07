import React from "react";
import { motion } from "framer-motion";

// استيراد صور الـ Assets ديالك
import heroImage from "../assets/hero-bg.jpg";
import imageSalles from "../assets/image-salles.jpg";
import imageTable from "../assets/image-table.jpg";
import imagePhoto from "../assets/image-photo.jpg";

// استيراد الـ WeddingBot اللي صاوبنا باش يعوض الأيقونة العادية
import WeddingBot from "./WeddingBot"; 

const Home = ({ setView }) => {
  return (
    <div className="w-full min-h-screen bg-[#F9F7F2] font-sans text-stone-800 selection:bg-[#D4AF37]/30 overflow-hidden"> 
      
      {/* --- Navigation Bar --- */} 
      <nav className="absolute top-0 left-0 w-full z-50 px-12 md:px-6 flex justify-between items-center bg-transparent py-6 box-border"> 
        
        {/* 1. اللوغو جهة اليسار */} 
        <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => setView?.('home')}> 
          <h1 className="text-xl md:text-2xl font-serif font-black tracking-[0.2em] text-[#0A2A22] uppercase italic" style={{ fontFamily: "'Playfair Display', serif" }}> 
            OURS 
          </h1> 
        </div> 

        {/* 2. الروابط في الوسط */} 
        <div className="flex items-center gap-6 md:gap-12 lg:gap-16 text-xs md:text-sm font-serif font-semibold italic tracking-[0.15em] uppercase flex-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}> 
          <button 
            onClick={() => setView?.('budget_estimator')} 
            className="bg-transparent border-none p-0 cursor-pointer text-[#0A2A22] hover:text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap"
          > 
            Budget Estimator 
          </button> 
          
          <button 
            onClick={() => setView?.('marketplace')} 
            className="bg-transparent border-none p-0 cursor-pointer text-[#0A2A22] hover:text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap"
          > 
            Marketplace 
          </button> 
          
          {/* 🎯 التعديل هنا: فاش يضغط المستخدم على Packs كيدوز نيشان لصفحة الـ Packs الجديدة */}
          <button 
            onClick={() => setView?.('packs')} 
            className="bg-transparent border-none p-0 cursor-pointer text-[#0A2A22] hover:text-[#D4AF37] transition duration-300 focus:outline-none whitespace-nowrap"
          > 
            Packs 
          </button> 
        </div> 

        {/* 3. زر Espace Pro جهة اليمين */} 
        <div className="flex items-center flex-shrink-0"> 
          <button 
            onClick={() => setView?.('login')} 
            className="bg-[#D4AF37] text-[#0A2A22] text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] px-4 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-[#bfa032] transition-all shadow-lg active:scale-95 whitespace-nowrap"
          > 
            Espace Pro 
          </button> 
        </div> 
      </nav>

      {/* ================= HERO ================= */}
      <section
        className="relative h-screen w-full flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(${heroImage})`
        }}
      >
        <div className="text-center z-10 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-[64px] text-[#0A2A22] italic text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            L'ART DE CÉLÉBRER
            <br />
            VOTRE UNION
          </motion.h1>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setView?.('marketplace')}
            className="mt-14 bg-[#D4AF37] text-[#0A2A22] uppercase tracking-[0.25em] text-sm px-12 py-5 rounded-full hover:bg-[#bfa032] transition-all"
          >
            Découvrir l'expérience Aura
          </motion.button>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-[1500px] mx-auto pt-72 pb-32 px-24">
        
        {/* FIRST BLOCK */}
        <div className="grid grid-cols-12 gap-14 items-center mb-56">
          <div className="col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <img
                src={imageSalles}
                alt=""
                className="w-[420px] h-[420px] object-cover shadow-xl"
              />
            </motion.div>
          </div>

          <div className="col-span-7">
            <div className="max-w-[650px]">
              <h2 className="text-[18px] uppercase tracking-[0.35em] text-[#D4AF37] mb-10">
                L'Élite des Prestataires
              </h2>
              <p className="text-[18px] leading-[1.9] uppercase tracking-[0.06em] text-stone-700 text-[#0A2A22]">
                Nous avons sélectionné pour vous les prestataires les plus
                prestigieux du Royaume. Des salles majestueuses aux traiteurs
                raffinés, chaque detail est validé par nos soins pour garantir
                l'excellence de votre union.
              </p>
            </div>
          </div>
        </div>

        {/* SECOND BLOCK */}
        <div className="grid grid-cols-12 gap-14 items-center mb-56">
          <div className="col-span-6">
            <div className="max-w-[650px]">
              <h2 className="text-[18px] uppercase tracking-[0.35em] text-[#D4AF37] mb-10">
                Organisation Sur-Mesure
              </h2>
              <p className="text-[18px] leading-[1.9] uppercase tracking-[0.06em] text-stone-700 text-[#0A2A22]">
                Chaque élément est soigneusement sélectionné afin d'offrir une
                expérience unique. Nos partenaires d'exception répondent aux
                exigences les plus élevées pour sublimer votre célébration.
              </p>
            </div>
          </div>

          <div className="col-span-6 flex justify-end">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <img
                src={imageTable}
                alt=""
                className="w-[500px] h-[320px] object-cover shadow-xl"
              />
            </motion.div>
          </div>
        </div>

        {/* THIRD BLOCK */}
        <div className="grid grid-cols-12 gap-14 items-center">
          <div className="col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <img
                src={imagePhoto}
                alt=""
                className="w-[380px] h-[520px] object-cover shadow-xl"
              />
            </motion.div>
          </div>

          <div className="col-span-7">
            <div className="max-w-[700px]">
              <blockquote
                className="text-[24px] leading-[2em] uppercase text-stone-700 text-[#0A2A22]" 
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                “L'INTELLIGENCE AU SERVICE
                <br />
                DE VOTRE RÊVE”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 هنا حطينا الـ WeddingBot الذكي ديالنا باش يظهر في جميع أرجاء الصفحة الرئيسية */}
      <WeddingBot />

      {/* GOLD LINE */}
      <div className="w-full flex justify-center pb-6">
        <div className="w-[100%] h-[3px] bg-[#D4AF37]" />
      </div>

    </div>
  );
};

export default Home;