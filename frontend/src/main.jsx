import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/noto-sans-telugu/400.css';
import '@fontsource/noto-sans-telugu/600.css';
import '@fontsource/noto-sans-telugu/700.css';
import '@fontsource/noto-sans-tamil/400.css';
import '@fontsource/noto-sans-tamil/600.css';
import '@fontsource/noto-sans-tamil/700.css';
import './styles/index.css';
import App from './App.jsx';
import { AssessmentProvider } from './hooks/AssessmentContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AssessmentProvider>
      <App />
    </AssessmentProvider>
  </React.StrictMode>,
);
