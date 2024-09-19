import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  answers: [{ answer: { type: String, required: true } }],
  correctAnswer: { type: String, required: true },
  weight: { type: Number, required: true }
});

const QuestionnaireSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true }
});

export const Questionnaire = mongoose.model('Questionnaire', QuestionnaireSchema);
