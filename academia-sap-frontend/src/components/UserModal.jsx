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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Cambiar Contraseña</h1>
            <p className="text-amber-200 text-sm mt-1">Establece tu nueva contraseña</p>
          </div>

          <form onSubmit={handlePasswordChange} className="p-8 space-y-5">
            <div className="bg-amber-50 text-amber-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Primera vez?</p>
                <p className="text-xs mt-1">Debes cambiar tu contraseña antes de continuar. Esta será tu contraseña definitiva.</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Nueva Contraseña</label>
              <input type="password" value={passwordForm.password} onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })} required minLength="6" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="••••••••" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Confirmar Contraseña</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required minLength="6" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white font-semibold py-3 rounded-lg hover:bg-amber-700 transition-colors text-sm shadow-lg shadow-amber-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Guardar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Academia SAP</h1>
              <p className="text-xs text-slate-500">Portal de Gestión</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">{user?.nombre} {user?.apellido}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                  {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
              {user?.role === 'admin' ? (
                <img src="/admin-avatar.png" alt="Admin" className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                  {user?.nombre?.charAt(0)}
                </div>
              )}
            </div>
            <button onClick={logout} className="text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Cerrar sesión">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {user?.role === 'admin' ? 'Usuarios Registrados' : 'Mi Perfil'}
              </h2>
              <p className="text-sm text-slate-500">
                {user?.role === 'admin' ? 'Lista de todos los usuarios de la academia' : 'Tus datos personales'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1.5 rounded-full">
                {usuarios.length} {usuarios.length === 1 ? 'registro' : 'registros'}
              </span>
              {user?.role === 'admin' && (
                <button onClick={() => { setIsOpen(true); setError(''); setSuccess(''); setForm({ nombre: '', apellido: '', empresa: '', telefono: '+51 ', cargo: '', email: '', comentario: '' }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nuevo Usuario
                </button>
              )}
            </div>
          </div>

          {loading && usuarios.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Apellido</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cargo</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((usuario, idx) => (
                    <tr key={usuario.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/30 transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                            {usuario.nombre?.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-700">{usuario.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{usuario.apellido}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{usuario.empresa}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{usuario.telefono}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{usuario.cargo}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{usuario.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(usuario)} className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Editar">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {user?.role === 'admin' && (
                            <button onClick={() => handleDelete(usuario.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Eliminar">
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
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-1">Sin registros</h3>
              <p className="text-sm text-slate-500">{user?.role === 'admin' ? 'Aún no hay usuarios registrados' : 'No hay datos disponibles'}</p>
            </div>
          )}
        </div>
      </main>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Nuevo Usuario</h2>
                  <p className="text-blue-200 text-sm mt-0.5">Complete todos los campos</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
              {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg">{success}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Nombre</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Apellido</label>
                  <input name="apellido" value={form.apellido} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Empresa</label>
                <input name="empresa" value={form.empresa} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Teléfono</label>
                <div className="flex gap-2">
                  <span className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 font-medium">+51</span>
                  <input name="telefono" value={form.telefono} onChange={handleChange} required className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Cargo</label>
                <input name="cargo" value={form.cargo} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Comentario</label>
                <textarea name="comentario" value={form.comentario} onChange={handleChange} rows="3" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-slate-100 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-200 transition-colors text-sm">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Editar Usuario</h2>
                  <p className="text-amber-200 text-sm mt-0.5">{user?.role === 'admin' ? 'Modificar datos del usuario' : 'Modifica tus datos personales'}</p>
                </div>
                <button onClick={() => setIsEditOpen(false)} className="text-white/80 hover:text-white w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-5">
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
              {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg">{success}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Nombre</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Apellido</label>
                  <input name="apellido" value={form.apellido} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Empresa</label>
                <input name="empresa" value={form.empresa} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Teléfono</label>
                <div className="flex gap-2">
                  <span className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 font-medium">+51</span>
                  <input name="telefono" value={form.telefono} onChange={handleChange} required className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Cargo</label>
                <input name="cargo" value={form.cargo} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Comentario</label>
                <textarea name="comentario" value={form.comentario} onChange={handleChange} rows="3" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none" />
              </div>

              {user?.role === 'admin' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Reiniciar Contraseña</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="radio" name="resetPassword" value="yes" checked={resetPassword === 'yes'} onChange={handleResetPasswordChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      Sí
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="radio" name="resetPassword" value="no" checked={resetPassword === 'no'} onChange={handleResetPasswordChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      No
                    </label>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Si marca "Sí", el usuario deberá cambiar su contraseña al iniciar sesión</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 bg-slate-100 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-200 transition-colors text-sm">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 bg-amber-600 text-white font-medium py-2.5 rounded-lg hover:bg-amber-700 transition-colors text-sm shadow-lg shadow-amber-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserModal;
