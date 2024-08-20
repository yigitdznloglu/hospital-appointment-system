import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctor extends Document {
    name: string;
    specialization: string;
    department: Types.ObjectId; // Ref to Department model
}

const doctorSchema = new Schema<IDoctor>({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
});

const Doctor = model<IDoctor>('Doctor', doctorSchema);

export default Doctor;