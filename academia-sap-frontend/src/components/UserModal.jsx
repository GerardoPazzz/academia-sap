import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserModal = () => {
  const { user, logout, token, constrainedToken, changePassword } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [resetPassword, setResetPassword] = useState('no');
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    empresa: '',
    telefono: '+51 ',
    cargo: '',
    email: '',
    comentario: ''
  });

  useEffect(() => {
    if (user?.passwordChangeRequired) {
      setShowPasswordModal(true);
    }
  }, [user]);

  useEffect(() => {
    if (!constrainedToken && token) {
      fetchUsuarios();
    }
  }, [constrainedToken, token]);

  const fetchUsuarios = async () => {
    if (constrainedToken) return;
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    if (passwordForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    const result = await changePassword(passwordForm.password);
    if (result.success) {
      setShowPasswordModal(false);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleResetPasswordChange = (e) => {
    setResetPassword(e.target.value);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`http://localhost:3000/usuarios/${editingUser.id}`, { ...form, resetPassword });
      setSuccess('Usuario actualizado exitosamente');
      setTimeout(() => setIsEditOpen(false), 1500);
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`http://localhost:3000/usuarios/${editingUser.id}`, { ...form, resetPassword });
      setSuccess('Usuario actualizado exitosamente');
      setTimeout(() => setIsEditOpen(false), 1500);
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (usuario) => {
    setEditingUser(usuario);
    setResetPassword('no');
    setForm({
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      empresa: usuario.empresa || '',
      telefono: usuario.telefono || '+51 ',
      cargo: usuario.cargo || '',
      email: usuario.email || '',
      comentario: usuario.comentario || ''
    });
    setIsEditOpen(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await axios.delete(`http://localhost:3000/usuarios/${id}`);
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  if (showPasswordModal) {
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
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-magenta to-neon-purple rotate-12 mb-4">
                  <svg className="w-8 h-8 text-white -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="font-display text-3xl font-bold text-text-primary">CAMBIAR CONTRASEÑA</h2>
                <p className="text-text-muted text-sm mt-2 tracking-widest uppercase">Establece tu nueva contraseña</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5">
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
                    value={passwordForm.password} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })} 
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
                    value={passwordForm.confirmPassword} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} 
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
  }

  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl"></div>
      </div>

      <header className="relative z-10 bg-surface/80 backdrop-blur-xl border-b border-neon-cyan/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 animate-fade-in-up">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center rotate-12 shadow-neon-cyan">
                <span className="text-void font-display font-bold text-xl -rotate-12">S</span>
              </div>
              <div className="absolute -inset-1 bg-neon-cyan/20 rounded-xl blur opacity-60 -z-10"></div>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                ACADEMIA <span className="neon-text-cyan">SAP</span>
              </h1>
              <p className="text-xs text-text-muted tracking-widest uppercase">Portal de Gestión</p>
            </div>
          </div>

          <div className="flex items-center gap-6 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-body font-medium text-text-primary">{user?.nombre} {user?.apellido}</p>
                <span className={`text-xs px-3 py-1 rounded-full tracking-wider uppercase ${user?.role === 'admin' ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'}`}>
                  {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
              {user?.role === 'admin' ? (
                <div className="relative">
                  <img src="/admin-avatar.png" alt="Admin" className="w-11 h-11 rounded-xl object-cover border-2 border-neon-cyan/30" onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-40"></div>
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center text-sm font-display font-bold text-void">
                  {user?.nombre?.charAt(0)}
                </div>
              )}
            </div>
            <button 
              onClick={logout} 
              className="text-text-muted hover:text-neon-magenta p-3 rounded-xl hover:bg-neon-magenta/10 transition-all duration-300 border border-transparent hover:border-neon-magenta/30" 
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="glass-card rounded-2xl overflow-hidden animate-scale-in">
          <div className="px-6 py-5 bg-surface/50 border-b border-neon-cyan/10 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-text-primary tracking-tight">
                {user?.role === 'admin' ? 'USUARIOS REGISTRADOS' : 'MI PERFIL'}
              </h2>
              <p className="text-sm text-text-muted mt-1">
                {user?.role === 'admin' ? 'Lista de todos los usuarios de la academia' : 'Tus datos personales'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 text-sm font-body font-medium px-4 py-2 rounded-xl tracking-wider">
                {usuarios.length} {usuarios.length === 1 ? 'registro' : 'registros'}
              </span>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => { setIsOpen(true); setError(''); setSuccess(''); setForm({ nombre: '', apellido: '', empresa: '', telefono: '+51 ', cargo: '', email: '', comentario: '' }); }} 
                  className="bg-gradient-to-r from-neon-cyan to-neon-purple text-void font-display font-bold px-5 py-2.5 rounded-xl hover:shadow-glow transition-all duration-300 flex items-center gap-2 text-sm tracking-wider uppercase"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nuevo Usuario
                </button>
              )}
            </div>
          </div>

          {loading && usuarios.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-neon-magenta/20 border-t-neon-magenta rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDelay: '0.5s' }}></div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface/80">
                    <th className="px-6 py-4 text-left text-xs font-body font-semibold text-text-muted uppercase tracking-widest">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-body font-semibold text-text-muted uppercase tracking-widest">Apellido</th>
                    <th className="px-6 py-4 text-left text-xs font-body font-semibold text-text-muted uppercase tracking-widest">Empresa</th>
                    <th className="px-6 py-4 text-left text-xs font-body font-semibold text-text-muted uppercase tracking-widest">Teléfono</th>
                    <th className="px-6 py-4 text-left text-xs font-body font-semibold text-text-muted uppercase tracking-widest">Cargo</th>
                    <th className="px-6 py-4 text-left text-xs font-body font-semibold text-text-muted uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-body font-semibold text-text-muted uppercase tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neon-cyan/5">
                  {usuarios.map((usuario, idx) => (
                    <tr key={usuario.id} className="bg-surface/40 hover:bg-surface/60 transition-colors duration-200 animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/30 flex items-center justify-center text-sm font-display font-bold text-neon-cyan">
                            {usuario.nombre?.charAt(0)}
                          </div>
                          <span className="font-body font-medium text-text-primary">{usuario.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-body text-text-muted">{usuario.apellido}</td>
                      <td className="px-6 py-4 text-sm font-body text-text-muted">{usuario.empresa}</td>
                      <td className="px-6 py-4 text-sm font-body text-text-muted">{usuario.telefono}</td>
                      <td className="px-6 py-4 text-sm font-body text-text-muted">{usuario.cargo}</td>
                      <td className="px-6 py-4 text-sm font-body text-text-muted">{usuario.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(usuario)} 
                            className="text-neon-cyan hover:text-white p-2.5 rounded-xl hover:bg-neon-cyan/20 transition-all duration-300 border border-transparent hover:border-neon-cyan/30" 
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {user?.role === 'admin' && (
                            <button 
                              onClick={() => handleDelete(usuario.id)} 
                              className="text-red-400 hover:text-white p-2.5 rounded-xl hover:bg-red-500/20 transition-all duration-300 border border-transparent hover:border-red-500/30" 
                              title="Eliminar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {usuarios.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface border border-neon-cyan/20 mb-6">
                <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-medium text-text-primary mb-2">Sin registros</h3>
              <p className="text-sm text-text-muted">{user?.role === 'admin' ? 'Aún no hay usuarios registrados' : 'No hay datos disponibles'}</p>
            </div>
          )}
        </div>
      </main>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-void/80 backdrop-blur-xl" onClick={() => setIsOpen(false)}></div>
          <div className="relative w-full max-w-md animate-scale-in">
            <div className="glass-card rounded-3xl p-1">
              <div className="bg-surface rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta px-6 py-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-surface/30"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-white tracking-tight">NUEVO USUARIO</h2>
                      <p className="text-white/70 text-sm mt-1">Complete todos los campos</p>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)} 
                      className="text-white/70 hover:text-white w-12 h-12 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all duration-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {error && <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
                  {success && <div className="bg-green-900/30 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">{success}</div>}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Nombre</label>
                      <input 
                        name="nombre" 
                        value={form.nombre} 
                        onChange={handleChange} 
                        required 
                        className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Apellido</label>
                      <input 
                        name="apellido" 
                        value={form.apellido} 
                        onChange={handleChange} 
                        required 
                        className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan transition-all duration-300" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Empresa</label>
                    <input 
                      name="empresa" 
                      value={form.empresa} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan transition-all duration-300" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Teléfono</label>
                    <div className="flex gap-2">
                      <span className="bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm text-neon-cyan font-body font-medium">+51</span>
                      <input 
                        name="telefono" 
                        value={form.telefono} 
                        onChange={handleChange} 
                        required 
                        className="flex-1 bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan transition-all duration-300" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Cargo</label>
                    <input 
                      name="cargo" 
                      value={form.cargo} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan transition-all duration-300" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Email</label>
                    <input 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan transition-all duration-300" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Comentario</label>
                    <textarea 
                      name="comentario" 
                      value={form.comentario} 
                      onChange={handleChange} 
                      rows="3" 
                      className="w-full bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-cyan transition-all duration-300 resize-none" 
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsOpen(false)} 
                      className="flex-1 bg-surface-light border border-text-muted/20 text-text-muted font-body font-medium py-3 rounded-xl hover:bg-surface-light/80 transition-colors text-sm tracking-wider uppercase"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-purple text-void font-display font-bold py-3 rounded-xl hover:shadow-glow transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm tracking-wider uppercase"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-void/30 border-t-void rounded-full animate-spin"></div>
                      ) : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-void/80 backdrop-blur-xl" onClick={() => setIsEditOpen(false)}></div>
          <div className="relative w-full max-w-md animate-scale-in">
            <div className="glass-card rounded-3xl p-1">
              <div className="bg-surface rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-neon-magenta via-neon-purple to-neon-cyan px-6 py-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-surface/30"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-white tracking-tight">EDITAR USUARIO</h2>
                      <p className="text-white/70 text-sm mt-1">{user?.role === 'admin' ? 'Modificar datos del usuario' : 'Modifica tus datos personales'}</p>
                    </div>
                    <button 
                      onClick={() => setIsEditOpen(false)} 
                      className="text-white/70 hover:text-white w-12 h-12 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all duration-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleEdit} className="p-6 space-y-5">
                  {error && <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
                  {success && <div className="bg-green-900/30 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">{success}</div>}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Nombre</label>
                      <input 
                        name="nombre" 
                        value={form.nombre} 
                        onChange={handleChange} 
                        required 
                        className="w-full bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-magenta transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Apellido</label>
                      <input 
                        name="apellido" 
                        value={form.apellido} 
                        onChange={handleChange} 
                        required 
                        className="w-full bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-magenta transition-all duration-300" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Empresa</label>
                    <input 
                      name="empresa" 
                      value={form.empresa} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-magenta transition-all duration-300" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Teléfono</label>
                    <div className="flex gap-2">
                      <span className="bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm text-neon-magenta font-body font-medium">+51</span>
                      <input 
                        name="telefono" 
                        value={form.telefono} 
                        onChange={handleChange} 
                        required 
                        className="flex-1 bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-magenta transition-all duration-300" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Cargo</label>
                    <input 
                      name="cargo" 
                      value={form.cargo} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-magenta transition-all duration-300" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Email</label>
                    <input 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-magenta transition-all duration-300" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-2">Comentario</label>
                    <textarea 
                      name="comentario" 
                      value={form.comentario} 
                      onChange={handleChange} 
                      rows="3" 
                      className="w-full bg-surface-light border border-neon-magenta/20 rounded-xl px-4 py-3 text-sm font-body text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-neon-magenta transition-all duration-300 resize-none" 
                    />
                  </div>

                  {user?.role === 'admin' && (
                    <div className="bg-surface-light border border-neon-cyan/20 rounded-xl px-4 py-4">
                      <label className="block text-xs font-body font-medium text-text-muted uppercase tracking-widest mb-3">Reiniciar Contraseña</label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-3 text-sm font-body text-text-primary cursor-pointer group">
                          <input 
                            type="radio" 
                            name="resetPassword" 
                            value="yes" 
                            checked={resetPassword === 'yes'} 
                            onChange={handleResetPasswordChange} 
                            className="w-5 h-5 text-neon-cyan focus:ring-neon-cyan cursor-pointer" 
                          />
                          <span className="group-hover:text-neon-cyan transition-colors">Sí</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm font-body text-text-primary cursor-pointer group">
                          <input 
                            type="radio" 
                            name="resetPassword" 
                            value="no" 
                            checked={resetPassword === 'no'} 
                            onChange={handleResetPasswordChange} 
                            className="w-5 h-5 text-neon-cyan focus:ring-neon-cyan cursor-pointer" 
                          />
                          <span className="group-hover:text-neon-cyan transition-colors">No</span>
                        </label>
                      </div>
                      <p className="text-xs text-text-muted/60 mt-2">Si marca "Sí", el usuario deberá cambiar su contraseña al iniciar sesión</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsEditOpen(false)} 
                      className="flex-1 bg-surface-light border border-text-muted/20 text-text-muted font-body font-medium py-3 rounded-xl hover:bg-surface-light/80 transition-colors text-sm tracking-wider uppercase"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 bg-gradient-to-r from-neon-magenta to-neon-purple text-white font-display font-bold py-3 rounded-xl hover:shadow-neon-magenta transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm tracking-wider uppercase"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserModal;