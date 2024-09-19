import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Radio, Button, Typography, message, Card, Divider, Progress, Spin, Alert } from 'antd';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

interface Question {
  text: string;
  answers: string[]; 
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
const baseURL = process.env.REACT_APP_BASE_URL;

const QuestionnaireView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [form] = Form.useForm();
  const [percentage, setPercentage] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get<Questionnaire>(`${baseURL}/api/questionnaire/${id}`);
        setQuestionnaire(response.data);
        console.log("Fetched Questionnaire:", response.data); // Debug log
      } catch (error) {
        console.error('Error fetching questionnaire', error);
        setError('Failed to load the questionnaire.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, [id]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await axios.post(`${baseURL}/api/questionnaire/${id}/submit`, {
        answers: Object.values(values),
      });

      const { score } = response.data;
      const totalWeight = questionnaire?.questions.reduce((total, question) => total + question.weight, 0) || 0;
      const percentageScore = totalWeight > 0 ? (score / totalWeight) * 100 : 0;

      setPercentage(Math.round(percentageScore)); 

      message.success('Answers submitted successfully!');
    } catch (error) {
      console.error('Error submitting answers', error);
      message.error('Error submitting answers');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin tip="Loading..." />
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Alert message={error} type="error" />
    </div>
  );

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
                <Radio.Group style={{flexDirection:'column'}}>
                  {question.answers.map((answer, idx) => (
                    <Radio key={idx} value={answer}>
                      {answer}
                    </Radio>
                  ))}
                </Radio.Group>
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
              format={percent => `${percent}%`}
              width={120}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text>{`You scored ${percentage}%`}</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuestionnaireView;

