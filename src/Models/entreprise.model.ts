import { Schema, model, Document } from 'mongoose';

interface IEntreprise extends Document {
  social_reason: string;
  
}

const EntrepriseSchema = new Schema<IEntreprise>({
  social_reason: {
    type: String,
    required: true,
  },
  
});

const Entreprise = model<IEntreprise>('Entreprise', EntrepriseSchema);

export { Entreprise, IEntreprise };
