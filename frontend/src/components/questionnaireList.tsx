import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, List, Typography, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface Questionnaire {
  _id: string;
  title: string;
}

const QuestionnaireList = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/questionnaire"
        );
        setQuestionnaires(response.data);
      } catch (error) {
        setError("Error fetching questionnaires");
        console.error("Error fetching questionnaires", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);
  
    const handleSelect = (id: string) => {
        navigate(`/questionnaire/${id}`); 
      };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin tip="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert message={error} type="error" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Available Questionnaires
      </Title>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Button
          type="primary"
          onClick={() => navigate("/create-questionnaire")}
        >
          Add New Questionnaire
        </Button>
      </div>
      <List
        dataSource={questionnaires}
        renderItem={(item: Questionnaire) => (
          <List.Item
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 20px",
              marginBottom: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            actions={[
              <Button
                onClick={() => {
                  console.log("Selected Questionnaire ID:", item._id);
                  handleSelect(item._id);
                }}
                type="primary"
              >
                View
              </Button>,
            ]}
          >
            <div>{item.title}</div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default QuestionnaireList;
