
import React, { useState } from 'react';

interface MfaLoginProps {
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

const MfaLogin: React.FC<MfaLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulación de validación corporativa
    setTimeout(() => {
      onLoginSuccess({
        name: email ? email.split('@')[0].toUpperCase() : 'USER_ADMIN',
        email: email || 'admin@documind.pro'
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Lado Izquierdo - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 p-20 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-brain text-white text-lg"></i>
            </div>
            <span className="text-white font-black text-2xl tracking-tighter">DOCUMIND PRO</span>
          </div>
          
          <h1 className="text-5xl font-black text-white leading-tight mb-8">
            Gestión inteligente de documentos <span className="text-indigo-400">vía IA.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Plataforma de procesamiento OCR avanzado con clasificación automática y extracción de campos críticos para flujos administrativos.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-slate-500 font-bold text-sm tracking-widest uppercase">
          <span>Enterprise Edition</span>
          <span>SLA 99.9%</span>
          <span>v2.5.0</span>
        </div>

        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Bienvenido</h2>
            <p className="text-slate-500 font-medium">Inicia sesión con tu cuenta corporativa.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email del empleado</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input 
                  type="email" 
                  required
                  placeholder="nombre@empresa.com"
                  className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold px-1">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Recordarme
              </label>
              <a href="#" className="text-indigo-600 hover:text-indigo-700">¿Olvidaste la clave?</a>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/10 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-slate-400 font-medium">
            Al acceder, aceptas nuestra <a href="#" className="underline">Política de Privacidad</a> y <a href="#" className="underline">Términos de Servicio</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MfaLogin;
