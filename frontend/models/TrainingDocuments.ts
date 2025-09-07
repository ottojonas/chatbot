import mongoose, { Document, Schema } from "mongoose";

export interface ITrainingDocument extends Document {
  key: string;
  title: string;
  content: string;
  images: string[];
}

const TrainingDocumentSchema = new mongoose.Schema<ITrainingDocument>({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  content: {
    type: String,
    required: true,
    unique: false,
  },
  images: [{ type: String }],
});

const TrainingDocument =
  mongoose.models.TrainingDocument ||
  mongoose.model<ITrainingDocument>("TrainingDocument", TrainingDocumentSchema);

export default TrainingDocument;
