import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, List, Typography } from 'antd';

const { Title } = Typography;

const QuestionnaireList: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/questionnaire');
        setQuestionnaires(response.data);
      } catch (error) {
        console.error('Error fetching questionnaires', error);
      }
    };

    fetchQuestionnaires();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Available Questionnaires</Title>
      <List
        bordered
        dataSource={questionnaires}
        renderItem={(item: any) => (
          <List.Item>
            <div style={{ flex: 1 }}>{item.title}</div>
            <Button onClick={() => onSelect(item._id)} type="primary">
              View
            </Button>
          </List.Item>
        )}
      />
    </div>
  );
};

export default QuestionnaireList;
