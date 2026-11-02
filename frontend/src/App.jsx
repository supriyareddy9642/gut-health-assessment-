import { useEffect } from 'react';
import AppShell from './components/AppShell.jsx';
import { useAssessment } from './hooks/AssessmentContext.jsx';
import Welcome from './pages/Welcome.jsx';
import PatientDetails from './pages/PatientDetails.jsx';
import Question from './pages/Question.jsx';
import Submitting from './pages/Submitting.jsx';
import SubmitError from './pages/SubmitError.jsx';
import Result from './pages/Result.jsx';

const SCREENS = {
  welcome: Welcome,
  details: PatientDetails,
  questions: Question,
  submitting: Submitting,
  error: SubmitError,
  result: Result,
};

export default function App() {
  const { state } = useAssessment();
  const Screen = SCREENS[state.screen];
  // Re-key per screen/question so each change plays the entrance transition.
  const key = state.screen === 'questions' ? `q-${state.questionIndex}` : state.screen;

  useEffect(() => { document.documentElement.lang = state.language; }, [state.language]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [key]);

  return (
    <AppShell showHeader={state.screen !== 'welcome'}>
      <div key={key} className="animate-step-in">
        <Screen />
      </div>
    </AppShell>
  );
}
