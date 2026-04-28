import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = isRegister
      ? await register(form.nombre, form.apellido, form.email, form.password)
      : await login(form.email, form.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple rotate-12 mb-6 shadow-neon-cyan">
            <span className="text-void font-display font-bold text-4xl -rotate-12">S</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-text-primary tracking-tight">
            ACADEMIA <span className="neon-text-cyan">SAP</span>
          </h1>
          <p className="text-text-muted font-body mt-2 text-sm tracking-widest uppercase">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-1 animate-scale-in">
          <div className="bg-surface rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-3 animate-slide-in">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {isRegister && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="animate-fade-in-up stagger-1">
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Nombre</label>
                    <input 
                      name="nombre" 
                      value={form.nombre} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300" 
                      placeholder="Juan" 
                    />
                  </div>
                  <div className="animate-fade-in-up stagger-2">
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Apellido</label>
                    <input 
                      name="apellido" 
                      value={form.apellido} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300" 
                      placeholder="Pérez" 
                    />
                  </div>
                </div>
              )}

              <div className="animate-fade-in-up stagger-2">
                <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300" 
                  placeholder="juan.perez@sap.com" 
                />
              </div>

              <div className="animate-fade-in-up stagger-3">
                <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Contraseña</label>
                <input 
                  name="password" 
                  type="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  required 
                  minLength="6" 
                  className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300" 
                  placeholder="••••••••" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full relative overflow-hidden bg-gradient-to-r from-neon-cyan to-neon-purple text-void font-display font-bold py-4 rounded-xl hover:shadow-glow transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 text-sm tracking-wider uppercase animate-fade-in-up stagger-4 group"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-void/30 border-t-void rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="relative">{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
                    <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              <div className="text-center pt-2 animate-fade-in-up stagger-5">
                <button 
                  type="button" 
                  onClick={() => { setIsRegister(!isRegister); setError(''); setForm({ nombre: '', apellido: '', email: '', password: '' }); }} 
                  className="text-sm font-body text-text-muted hover:text-neon-cyan transition-colors duration-300"
                >
                  {isRegister ? (
                    <span>¿Ya tienes cuenta? <span className="text-neon-cyan">Inicia sesión</span></span>
                  ) : (
                    <span>¿No tienes cuenta? <span className="text-neon-magenta">Regístrate</span></span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-text-muted/50 text-xs font-body mt-6 tracking-wide animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
          Sistema de Gestión de Usuarios
        </p>
      </div>
    </div>
  );
};

export default Login;