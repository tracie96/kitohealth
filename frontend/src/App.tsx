import React, { useState } from 'react';
import QuestionnaireForm from './components/questionaire';
import QuestionnaireView from './components/questionnaireView';
import QuestionnaireList from './components/questionnaireList';
import { Button } from 'antd';

const App: React.FC = () => {
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(true);

  return (
    <div className="App">
      {isCreating && !selectedQuestionnaireId && (
        <div>
          <QuestionnaireForm />
          <Button type="link" onClick={() => setIsCreating(false)}>View Questionnaires</Button>
        </div>
      )}

      {!isCreating && !selectedQuestionnaireId && (
        <QuestionnaireList onSelect={(id) => setSelectedQuestionnaireId(id)} />
      )}

      {selectedQuestionnaireId && (
        <div>
          <QuestionnaireView questionnaireId={selectedQuestionnaireId} />
          <Button type="link" onClick={() => setSelectedQuestionnaireId(null)}>Back to List</Button>
        </div>
      )}
    </div>
  );
};

export default App;
