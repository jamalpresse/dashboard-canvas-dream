import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Search, FileText, Languages, ImageIcon, Camera, Video, FileDown } from "lucide-react";
export const FeatureButtons: React.FC = () => {
  const {
    t,
    isRTL
  } = useLanguage();
  return <div className="mx-4 md:mx-8">
      {/* Features Buttons - Cartes modulaires éclatantes */}
      <div className={`cards-grid mb-6 ${isRTL ? 'rtl' : ''}`}>
        <Link to="/search" className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105 text-white font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 flex flex-col items-center justify-center space-y-2 min-h-[120px]">
          <Search className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{t('dashboard', 'search')}</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link to="/improve" className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 text-white font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 flex flex-col items-center justify-center space-y-2 min-h-[120px]">
          <FileText className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{t('dashboard', 'improve')}</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link to="/translation" className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 text-white font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 flex flex-col items-center justify-center space-y-2 min-h-[120px]">
          <Languages className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{t('dashboard', 'translate')}</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link to="/transcription" className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 text-white font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 flex flex-col items-center justify-center space-y-2 min-h-[120px]">
          <Camera className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{t('dashboard', 'transcription') || 'Transcription'}</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link to="/video-transcription" className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 hover:scale-105 text-white font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 flex flex-col items-center justify-center space-y-2 min-h-[120px]">
          <Video className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{t('dashboard', 'videoTranscription') || 'Transcription vidéo'}</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link to="/pdf-transcription" className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 text-white font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 flex flex-col items-center justify-center space-y-2 min-h-[120px]">
          <FileDown className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{t('dashboard', 'pdfTranscription') || 'Transcription PDF'}</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
      
      {/* Image Generation Button - Widget modulaire moderne */}
      <Link to="/image-generation" className="group relative overflow-hidden flex w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 hover:from-purple-700 hover:via-pink-600 hover:to-red-600 hover:scale-[1.02] text-white font-semibold py-8 px-8 rounded-2xl shadow-[0_20px_50px_-15px_rgba(147,51,234,0.4)] hover:shadow-[0_25px_60px_-15px_rgba(147,51,234,0.6)] transition-all duration-500 justify-center items-center space-x-4 mb-6 border border-purple-500/20">
        <div className="relative">
          <ImageIcon className="h-10 w-10 group-hover:scale-110 transition-all duration-300 drop-shadow-lg" />
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-all duration-300" />
        </div>
        <span className="text-xl font-bold tracking-wide drop-shadow-sm">{t('dashboard', 'imageGeneration')}</span>
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500" />
      </Link>
    </div>;
};