import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QuestionnaireList from './components/questionnaireList';
import CreateQuestionnaireForm from './components/questionaire';
import QuestionnaireView from './components/questionnaireView';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuestionnaireList />} />
        <Route path="/create-questionnaire" element={<CreateQuestionnaireForm />} />
        <Route path="/questionnaire/:id" element={<QuestionnaireView />} /> 
      </Routes>
    </Router>
  );
};

export default App;
