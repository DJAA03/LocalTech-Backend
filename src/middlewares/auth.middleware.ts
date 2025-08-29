import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.model';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRol?: 'cliente' | 'admin';
      user?: { nombre: string };
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado, se requiere un token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, rol: 'cliente' | 'admin' };
    
    const user = await Usuario.findById(decoded.id).select('nombre');
    if (!user) {
        return res.status(404).json({ message: 'El usuario asociado al token ya no existe.' });
    }

    req.userId = decoded.id;
    req.userRol = decoded.rol;
    req.user = { nombre: user.nombre };
    
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.userRol === 'admin') {
        next(); 
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
};