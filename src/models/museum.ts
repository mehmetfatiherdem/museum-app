import { Schema, model } from 'mongoose';
import { DayNames } from '../helpers/type';

type WorkingTimes = {
  [key in DayNames]: {
    opening: string;
    closing: string;
  } | null;
};

interface IMuseum {
  name: string;
  information: string;
  photo: string;
  builtYear: string;
  city: string;
  entranceFee: string;
  workingHours: WorkingTimes;
}

const museumSchema = new Schema<IMuseum>(
  {
    name: { type: String, required: true },
    information: { type: String, required: true },
    photo: { type: String, required: true },
    builtYear: { type: String, required: true },
    city: { type: String, required: true },
    entranceFee: { type: String, required: true, default: '0' },
    workingHours: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const Museum = model<IMuseum>(process.env.MUSEUM_MODEL_NAME, museumSchema);

export default Museum;
