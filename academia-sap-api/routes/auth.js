const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'academia-sap-secret-key';
const JWT_CONSTRAINED = 'academia-sap-constrained-key';

const generateToken = (user, type = 'full') => {
  const secret = type === 'constrained' ? JWT_CONSTRAINED : JWT_SECRET;
  const payload = type === 'constrained'
    ? { id: user.id, type: 'password-change' }
    : { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    let token, tokenType = 'full';
    if (user.passwordChangeRequired) {
      token = generateToken(user, 'constrained');
      tokenType = 'constrained';
    } else {
      token = generateToken(user, 'full');
    }

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role,
        passwordChangeRequired: user.passwordChangeRequired
      },
      token,
      tokenType
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

router.post('/change-password', async (req, res) => {
  try {
    const { password } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_CONSTRAINED);
    } catch {
      return res.status(403).json({ error: 'Token inválido para esta acción' });
    }

    if (decoded.type !== 'password-change') {
      return res.status(403).json({ error: 'No autorizado para cambiar contraseña' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.update({ password, passwordChangeRequired: false });

    const fullToken = generateToken(user, 'full');
    res.json({ message: 'Contraseña actualizada', token: fullToken });
  } catch (err) {
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const user = await User.create({ nombre, apellido, email, password, role: 'user' });
    const token = generateToken(user);
    res.status(201).json({ user: { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

module.exports = router;
