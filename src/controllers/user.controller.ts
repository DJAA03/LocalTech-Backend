import { Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import mongoose from 'mongoose';

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ message: 'El nombre es requerido.' });
        
        const updatedUser = await Usuario.findByIdAndUpdate(req.userId, { nombre }, { new: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado.' });
        
        res.json({ message: 'Perfil actualizado exitosamente.', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el perfil.' });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const user = await Usuario.findById(req.userId).select('+password');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
        
        user.password = newPassword;
        await user.save();
        
        res.json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar la contraseña.' });
    }
};

export const getWishlist = async (req: Request, res: Response) => {
    try {
        const user = await Usuario.findById(req.userId).populate({
            path: 'wishlist',
            populate: { path: 'categoria', select: 'nombre' }
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de deseos.' });
    }
};

export const toggleWishlist = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'El ID del producto no es válido.' });
        }

        const user = await Usuario.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
        
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const isProductInWishlist = user.wishlist.some(id => id.equals(productObjectId));

        const updateUserQuery = isProductInWishlist
            ? { $pull: { wishlist: productObjectId } }
            : { $addToSet: { wishlist: productObjectId } };

        const updatedUser = await Usuario.findByIdAndUpdate(req.userId, updateUserQuery, { new: true });
        
        res.json({ wishlist: updatedUser?.wishlist });
    } catch (error: any) {
        res.status(500).json({ message: `Error del servidor: ${error.message}` });
    }
};