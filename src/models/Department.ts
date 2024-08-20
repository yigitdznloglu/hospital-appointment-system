import { Schema, model, Document } from 'mongoose';

export interface IDepartment extends Document {
    name: string;
}

const departmentSchema = new Schema<IDepartment>({
    name: { type: String, required: true, unique: true },
});

const Department = model<IDepartment>('Department', departmentSchema);

export default Department;