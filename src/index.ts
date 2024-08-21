import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// DB Connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
}

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

// routes
app.use('/api/users', userRoutes);
app.get('/', (req: Request, res: Response) => {
    res.send('Hospital Appointment System API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

export default app;