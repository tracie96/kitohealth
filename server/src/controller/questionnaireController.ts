import { Request, Response } from 'express';
import { Questionnaire } from '../model/questionnaire';

// Create a new questionnaire
export const getQuestionnaire = async (req: Request, res: Response) => {
  try {
    const questionnaires = await Questionnaire.find();
    if (questionnaires.length === 0) {
      return res.status(404).json({ error: 'No questionnaires found' });
    }
    res.status(200).json(questionnaires);
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    res.status(500).json({ error: 'Error fetching questionnaires' });
  }
};
// Create a new questionnaire

export const createQuestionnaire = async (req: Request, res: Response) => {
  console.log(req.body);
  const { title, questions } = req.body;
  try {
    const newQuestionnaire = new Questionnaire({ title, questions });
    await newQuestionnaire.save();
    res.status(201).json({ message: 'Questionnaire created', questionnaire: newQuestionnaire });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: 'Failed to create questionnaire' });
  }
};

// Get by by ID
export const getQuestionnaireById = async (req: Request, res: Response) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }
    res.status(200).json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questionnaire' });
  }
};

// Submit my answers and get results

export const submitAnswers = async (req: Request, res: Response) => {
  const { answers } = req.body;
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    let score = 0;
    questionnaire.questions.forEach((question: any, index: number) => {
      const userAnswer = answers[index];
      if (question.correctAnswer === userAnswer) {
        score += question.weight;
      }
    });

    res.status(200).json({ message: 'Results', score });
  } catch (error) {
    res.status(500).json({ error: 'Error calculating results' });
  }
};
