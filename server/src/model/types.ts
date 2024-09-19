export interface IQuestion {
    text: string;
    answers: { answer: string }[]; 
    correctAnswer: string;
    weight: number;
  }
  
  export interface IQuestionnaire {
    title: string;
    questions: IQuestion[];
  }
  