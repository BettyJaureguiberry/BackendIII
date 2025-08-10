import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
mongoose.set('strictQuery', false);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Conectado a MongoDB Atlas');

    mongoose.connection.on('connected', () => {
      console.log('📡 Estado: conectado');
    });

    mongoose.connection.on('error', (err) => {
      console.error('🔴 Estado: error de conexión', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Estado: desconectado');
    });

  } catch (err) {
    console.error('🔴 Error al conectar con MongoDB Atlas:', err);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑 Desconectado de MongoDB Atlas');
  } catch (err) {
    console.error('⚠️ Error al desconectar:', err);
  }
};
