import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/producto.routes';
import orderRoutes from './routes/order.routes';
import categoriaRoutes from './routes/categoria.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userRoutes from './routes/user.routes';
import resenaRoutes from './routes/resena.routes';
import iaRoutes from './routes/ia.routes'; 

const app = express();
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ Conectado a la base de datos MongoDB'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/ia', iaRoutes); 

app.get('/api', (req, res) => {
  res.send('¡API de LocalTech funcionando! 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});