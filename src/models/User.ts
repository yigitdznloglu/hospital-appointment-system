import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    password: string;
}

const userSchema = new Schema<IUser>({
    name:  { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role:  { type: String, enum: ['patient', 'doctor', 'admin'], required: true},
    password: { type: String, required: true }, // hashed password
});

const User = model<IUser>('User', userSchema);

export default User;