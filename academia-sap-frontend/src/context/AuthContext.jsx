import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [constrainedToken, setConstrainedToken] = useState(localStorage.getItem('constrainedToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else if (constrainedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${constrainedToken}`;
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, [token, constrainedToken]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password });
      const { user, token, tokenType } = res.data;

      if (tokenType === 'constrained') {
        localStorage.setItem('constrainedToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setConstrainedToken(token);
        setToken(null);
      } else {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setToken(token);
        setConstrainedToken(null);
      }

      setUser(user);
      return { success: true, passwordChangeRequired: user.passwordChangeRequired };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error al iniciar sesión' };
    }
  };

  const changePassword = async (password) => {
    try {
      const res = await axios.post('http://localhost:3000/auth/change-password', { password });
      const { token: newToken } = res.data;

      localStorage.removeItem('constrainedToken');
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify({ ...user, passwordChangeRequired: false }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      setToken(newToken);
      setConstrainedToken(null);
      setUser({ ...user, passwordChangeRequired: false });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error al cambiar contraseña' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('constrainedToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setConstrainedToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, constrainedToken, login, changePassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
