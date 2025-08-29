import { Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;
    const emailExists = await Usuario.findOne({ email });
    if (emailExists) {
        return res.status(400).json({ message: 'El correo ya está registrado.' });
    }
    const newUser = new Usuario({ nombre, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al registrar.' });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, adminSecretCode } = req.body;
    if (adminSecretCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ message: 'Código de administrador incorrecto.' });
    }
    const emailExists = await Usuario.findOne({ email });
    if (emailExists) {
        return res.status(400).json({ message: 'El correo ya está registrado.' });
    }
    const newAdmin = new Usuario({ nombre, email, password, rol: 'admin' });
    await newAdmin.save();
    res.status(201).json({ message: 'Cuenta de administrador creada con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al registrar administrador.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email }).select('+password');
    if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    
    res.json({ 
        token, 
        user: { 
            id: user._id, 
            nombre: user.nombre, 
            email: user.email, 
            rol: user.rol,
            wishlist: user.wishlist
        } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión.' });
  }
};