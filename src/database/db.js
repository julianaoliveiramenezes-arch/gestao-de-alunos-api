import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoServer = await MongoMemoryServer.create();
const memoryMongoUri = mongoServer.getUri('gestao-de-alunos');

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão com o MongoDB:', err.message);
});

await mongoose.connect(memoryMongoUri);

console.log(`MongoDB em memória conectado em ${new URL(memoryMongoUri).host}`);

export async function closeDatabase() {
  await mongoose.connection.close();
  await mongoServer.stop();
}

export default mongoose;
