import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import { PORT, MONGO_URI } from './config';
import userRoutes from './routes/userRoutes';
import departmentRoutes from './routes/departmentRoutes';
import appointmentRoutes from './routes/appointmentRoutes';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// DB Connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

// routes
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.get('/', (req: Request, res: Response) => {
    res.send('Hospital Appointment System API');
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;