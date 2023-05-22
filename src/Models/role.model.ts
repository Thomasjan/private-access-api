import { Schema, model, Document } from 'mongoose';

interface IRole extends Document {
  title: string;
  
}

const RoleSchema = new Schema<IRole>({
  title: {
    type: String,
    required: true,
  },
  
});

const Role = model<IRole>('Role', RoleSchema);

export { Role, IRole };
