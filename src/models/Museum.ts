import { Schema, model, Types, Model } from 'mongoose';
import { getMuseumReturnVal, WorkingTimes } from '../helpers/type';

export interface IMuseum {
  name: string;
  information: string;
  photo: string;
  builtYear: string;
  city: string;
  entranceFee: string;
  workingHours: WorkingTimes;
  comments: [Types.ObjectId];
}

interface IMuseumMethods {
  serializedForMuseumEndpoints(): getMuseumReturnVal;
}

type MuseumModel = Model<IMuseum, unknown, IMuseumMethods>;

const museumSchema = new Schema<IMuseum, MuseumModel, IMuseumMethods>(
  {
    name: { type: String, required: true },
    information: { type: String, required: true },
    photo: { type: String, required: true },
    builtYear: { type: String, required: true },
    city: { type: String, required: true },
    entranceFee: { type: String, required: true, default: '0' },
    workingHours: { type: Object, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'comment', default: [] }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

museumSchema.method(
  'serializedForMuseumEndpoints',
  function serializedForMuseumEndpoints() {
    const info = {
      message: `Museum info for ${this.name} retrieved successfully`,
      data: {
        name: this.name,
        information: this.information,
        photo: this.photo,
        builtYear: this.builtYear,
        city: this.city,
        entranceFee: this.entranceFee,
        workingHours: this.workingHours,
        comments: this.comments,
      },
    };
    return info;
  }
);

const Museum = model<IMuseum, MuseumModel>(
  process.env.MUSEUM_MODEL_NAME,
  museumSchema
);

export default Museum;
