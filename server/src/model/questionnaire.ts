import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion {
  text: string;
  answers: [{ answer: String }], 
  correctAnswer: string;
  weight: number;
}

interface IQuestionnaire extends Document {
  title: string;
  questions: IQuestion[];
}

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  weight: { type: Number, required: true }
});

const QuestionnaireSchema = new Schema({
  title: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true }
});

export const Questionnaire = mongoose.model<IQuestionnaire>('Questionnaire', QuestionnaireSchema);
