import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import questionnaireRoutes from './routes/questionnaireRoutes.mjs';

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/questionnaire', questionnaireRoutes);

const uri="mongodb+srv://tracyaneledev:h3InYbE8oCNUrfqh@cluster0.yiomi.mongodb.net/questionaire?retryWrites=true&w=majority&appName=Cluster0"

async function initializeDatabase() {
  try {
    const connection = await mongoose.connect(uri);
    if(connection)
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function startServer() {
  await initializeDatabase();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
