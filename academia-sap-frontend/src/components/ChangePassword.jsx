import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    const result = await changePassword(password);
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="glass-card rounded-3xl p-1">
          <div className="bg-surface rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-magenta via-neon-cyan to-neon-purple"></div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-magenta to-neon-purple rotate-12 mb-4 shadow-neon-magenta">
                <svg className="w-8 h-8 text-white -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="font-display text-3xl font-bold text-text-primary tracking-tight">
                CAMBIAR <span className="neon-text-magenta">CONTRASEÑA</span>
              </h2>
              <p className="text-text-muted text-sm mt-2 tracking-widest uppercase">Establece tu nueva contraseña</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-neon-magenta/10 border border-neon-magenta/30 text-neon-magenta text-sm px-4 py-3 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Primera vez?</p>
                  <p className="text-xs mt-1 opacity-80">Debes cambiar tu contraseña antes de continuar. Esta será tu contraseña definitiva.</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength="6" 
                  className="w-full bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-magenta focus:shadow-neon-magenta transition-all duration-300" 
                  placeholder="••••••••" 
                />
              </div>

              <div>
                <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Confirmar Contraseña</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  minLength="6" 
                  className="w-full bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-magenta focus:shadow-neon-magenta transition-all duration-300" 
                  placeholder="••••••••" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-neon-magenta to-neon-purple text-white font-display font-bold py-4 rounded-xl hover:shadow-neon-magenta transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 text-sm tracking-wider uppercase"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Guardar Contraseña'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;