require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { sequelize, User } = require('./models/User');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'academia-sap-secret-key';
const JWT_CONSTRAINED = 'academia-sap-constrained-key';
const ADMIN_EMAIL = 'admin@academia-sap.com';
const ADMIN_PASSWORD = 'manage';

const generateFullToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
};

const generateConstrainedToken = (user) => {
  return jwt.sign({ id: user.id, type: 'password-change' }, JWT_CONSTRAINED, { expiresIn: '24h' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.tokenType = 'full';
    next();
  } catch (err) {
    try {
      const decoded = jwt.verify(token, JWT_CONSTRAINED);
      if (decoded.type !== 'password-change') {
        return res.status(403).json({ error: 'Token inválido' });
      }
      req.user = decoded;
      req.tokenType = 'constrained';
      req.needsPasswordChange = true;
      next();
    } catch {
      return res.status(403).json({ error: 'Token inválido' });
    }
  }
};

const requireFullToken = (req, res, next) => {
  if (req.tokenType === 'constrained') {
    return res.status(403).json({ error: 'Se requiere cambio de contraseña primero' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso solo para administradores' });
  }
  next();
};

app.use('/auth', authRoutes);

app.get('/usuarios', authenticateToken, requireFullToken, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const usuarios = await User.findAll({ where: { role: 'user' } });
      res.json(usuarios);
    } else {
      const usuario = await User.findByPk(req.user.id);
      res.json([usuario]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/usuarios', authenticateToken, requireFullToken, requireAdmin, async (req, res) => {
  try {
    const { resetPassword, ...userData } = req.body;
    const initialPassword = userData.email;
    const usuario = await User.create({
      ...userData,
      password: initialPassword,
      role: 'user',
      passwordChangeRequired: true
    });
    res.status(201).json(usuario);
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

app.delete('/usuarios/:id', authenticateToken, requireFullToken, requireAdmin, async (req, res) => {
  try {
    const targetUser = await User.findByPk(req.params.id);
    if (!targetUser) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (targetUser.role === 'admin') return res.status(403).json({ error: 'No se puede eliminar un administrador' });
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

app.put('/usuarios/:id', authenticateToken, requireFullToken, async (req, res) => {
  try {
    const targetUser = await User.findByPk(req.params.id);
    if (!targetUser) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (req.user.role === 'admin') {
      const { resetPassword, role, password, ...userData } = req.body;
      const updateData = { ...userData };
      if (resetPassword === 'yes' || resetPassword === true) {
        updateData.password = targetUser.email;
        updateData.passwordChangeRequired = true;
      }
      await targetUser.update(updateData);
    } else {
      if (req.user.id !== targetUser.id) {
        return res.status(403).json({ error: 'No puedes editar otros usuarios' });
      }
      const { nombre, apellido, empresa, telefono, cargo, email, comentario } = req.body;
      await targetUser.update({ nombre, apellido, empresa, telefono, cargo, email, comentario });
    }

    const usuario = await User.findByPk(req.params.id);
    res.json(usuario);
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (!existingAdmin) {
      await User.create({
        nombre: 'Admin',
        apellido: 'Sistema',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        passwordChangeRequired: true
      });
      console.log('Usuario administrador creado: admin@academia-sap.com / manage');
    } else {
      console.log('Admin ya existe: admin@academia-sap.com');
    }
  } catch (err) {
    console.error('Error al crear admin:', err);
  }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Conectado a PostgreSQL');
    await seedAdmin();
  } catch (err) {
    console.error('Error de conexión:', err);
  }
  console.log(`Servidor en puerto ${PORT}`);
});
