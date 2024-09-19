import React from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, Card, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const QuestionnaireForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const submitForm = async (values: any) => {
    const formattedValues = {
      ...values,
      questions: values.questions.map((question: any) => ({
        ...question,
        answers: question.answers.map((answerObj: any) => answerObj.answer),
      })),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/questionnaire', formattedValues);
      console.log(response.data);
      form.resetFields(); 
    } catch (error) {
      console.error('Error submitting questionnaire', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card bordered={false} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Create a Questionnaire</Title>
      <Button 
          type="link" 
          onClick={() => navigate('/')}
          style={{ marginBottom: '20px' }}
        >
        Back to List
        </Button>
        <Form
          form={form}
          onFinish={submitForm}
          initialValues={{ title: '', questions: [] }}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Questionnaire Title"
            rules={[{ required: true, message: 'Please enter the title!' }]}
          >
            <Input placeholder="Enter questionnaire title" />
          </Form.Item>

          <Divider orientation="left">Questions</Divider>

          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey }: any) => (
                  <Card
                    key={key}
                    title={`Question ${name + 1}`}
                    extra={
                      <Button type="link" onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                        Remove
                      </Button>
                    }
                    style={{ marginBottom: '16px' }}
                  >
                    <Form.Item
                      name={[name, 'text']}
                      fieldKey={[fieldKey, 'text']}
                      label="Question Text"
                      rules={[{ required: true, message: 'Please enter the question text!' }]}
                    >
                      <Input placeholder="Enter question text" />
                    </Form.Item>

                    <Form.List name={[name, 'answers']}>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, fieldKey }: any) => (
                            <Form.Item
                              name={[name, 'answer']}
                              fieldKey={[fieldKey, 'answer']}
                              key={key}
                              label={`Answer ${name + 1}`}
                              rules={[{ required: true, message: 'Please enter an answer!' }]}
                            >
                              <Input placeholder={`Enter answer ${name + 1}`} />
                            </Form.Item>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                            >
                              Add Answer
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Form.Item
                      name={[name, 'correctAnswer']}
                      fieldKey={[fieldKey, 'correctAnswer']}
                      label="Correct Answer"
                      rules={[{ required: true, message: 'Please enter the correct answer!' }]}
                    >
                      <Input placeholder="Enter correct answer" />
                    </Form.Item>

                    <Form.Item
                      name={[name, 'weight']}
                      fieldKey={[fieldKey, 'weight']}
                      label="Weight"
                      rules={[{ required: true, message: 'Please enter the weight!' }]}
                    >
                      <Input type="number" min={1} max={3} placeholder="Enter weight" />
                    </Form.Item>
                  </Card>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Question
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit Questionnaire
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default QuestionnaireForm;
