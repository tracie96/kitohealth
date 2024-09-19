import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message, Card, Divider, Progress } from 'antd';

const { Title, Text } = Typography;

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get<Questionnaire>(`http://localhost:5000/api/questionnaire/${questionnaireId}`);
        setQuestionnaire(response.data);
      } catch (error) {
        console.error('Error fetching questionnaire', error);
        message.error('Failed to load the questionnaire.');
      } finally {
        setLoading(false);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card bordered={false}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
          {questionnaire?.title}
        </Title>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          {questionnaire?.questions.map((question, index) => (
            <Card key={index} type="inner" style={{ marginBottom: '16px' }}>
              <Form.Item
                name={`question_${index}`}
                label={<Text strong>{`Question ${index + 1}: ${question.text}`}</Text>}
                rules={[{ required: true, message: 'Please answer this question!' }]}
              >
                <Input placeholder="Type your answer here..." />
              </Form.Item>
            </Card>
          ))}

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit Answers
            </Button>
          </Form.Item>
        </Form>

        {percentage !== null && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Title level={3}>Your Score</Title>
            <Progress
              type="circle"
              percent={percentage}
              format={percent => `${percent?.toFixed(2)}%`}
              width={120}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text>{`You scored ${percentage.toFixed(2)}%`}</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuestionnaireView;

