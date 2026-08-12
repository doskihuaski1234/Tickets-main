const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ticket-secret-key';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo cargar el perfil' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password, currentPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (currentPassword && user.password !== currentPassword) {
      return res.status(401).json({ error: 'La contraseña actual no es correcta' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'El correo ya está registrado' });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Perfil actualizado correctamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el perfil' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const newUser = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'Usuario creado correctamente', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    const userData = { name, email, password, role };

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const newUser = await User.create(userData);
    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Debes indicar tu correo' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'No existe una cuenta con este correo' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: 'Recuperación de contraseña - Tickets',
        html: `
          <p>Has solicitado recuperar tu contraseña.</p>
          <p>Usa el siguiente token para restablecerla:</p>
          <strong>${token}</strong>
          <p>Este token expirará en 1 hora.</p>
        `
      });
    }

    res.json({ message: 'Si el correo existe, se enviará un token para recuperar la contraseña.' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo procesar la recuperación de contraseña' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios' });
    }

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'El token es inválido o expiró' });
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo cambiar la contraseña' });
  }
};
