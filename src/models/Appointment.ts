import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';
import { IDoctor } from './Doctor';

export interface IAppointment extends Document {
    patient: IUser['_id'];
    doctor: IDoctor['_id'];
    date: Date;
    status: 'scheduled' | 'completed' | 'cancelled';
}

const appointmentSchema = new Schema<IAppointment>({
    patient: { type: Schema.Types.ObjectId, ref:'User', required: true },
    doctor:  { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date:    { type: Date, required: true },
    status:  { type: String, enum: ['scheduled', 'completed', 'cancelled'], required: true },
});

const Appointment = model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;