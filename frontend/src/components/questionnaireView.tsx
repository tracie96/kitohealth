import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title } = Typography;

interface Answer {
  answer: string;
}

interface Question {
  text: string;
  answers: Answer[];
  correctAnswer: string;
  weight: number;
}

interface Questionnaire {
  title: string;
  questions: Question[];
}

interface FormValues {
  [key: string]: string; 
}

interface QuestionnaireViewProps {
  questionnaireId: string;
}

const QuestionnaireView: React.FC<QuestionnaireViewProps> = ({ questionnaireId }) => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [form] = Form.useForm();
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get<Questionnaire>(`http://localhost:5000/api/questionnaire/${questionnaireId}`);
        setQuestionnaire(response.data);
      } catch (error) {
        console.error('Error fetching questionnaire', error);
      }
    };

    fetchQuestionnaire();
  }, [questionnaireId]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/questionnaire/${questionnaireId}/submit`, {
        answers: Object.values(values),
      });
      
      const { score } = response.data;
      const totalWeight = questionnaire?.questions.reduce((total, question) => total + question.weight, 0) || 0;
      const percentageScore = totalWeight > 0 ? (score / totalWeight) * 100 : 0;

      setPercentage(percentageScore);

      message.success('Answers submitted successfully!');
    } catch (error) {
      console.error('Error submitting answers', error);
      message.error('Error submitting answers');
    }
  };

  if (!questionnaire) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{questionnaire.title}</Title>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        {questionnaire.questions.map((question, index) => (
          <div key={index} style={{ marginBottom: '16px' }}>
            <Form.Item
              name={`question_${index}`}
              label={`Question ${index + 1}: ${question.text}`}
              rules={[{ required: true, message: 'Please answer this question!' }]}
            >
              <Input placeholder={`Your answer`} />
            </Form.Item>
          </div>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Answers
          </Button>
        </Form.Item>
      </Form>
      {percentage !== null && (
        <div style={{ marginTop: '20px' }}>
          <Title level={3}>Your Score</Title>
          <p>{`You scored ${percentage.toFixed(2)}%`}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireView;
