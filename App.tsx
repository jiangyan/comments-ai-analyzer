import React, { useState, createContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ParserView } from './components/ParserView';
import { AnalysisView } from './components/AnalysisView';
import { RawComment, AnalyzedComment, AppContextType } from './types';

// Create Context
export const AppContext = createContext<AppContextType>({
  comments: [],
  setComments: () => {},
  analyzedData: [],
  setAnalyzedData: () => {},
});

const App: React.FC = () => {
  const [comments, setComments] = useState<RawComment[]>([]);
  const [analyzedData, setAnalyzedData] = useState<AnalyzedComment[]>([]);

  // Reset analysis if comments change completely (optional, depends on UX preference)
  const handleSetComments = (newComments: RawComment[]) => {
    setComments(newComments);
    if (newComments.length !== comments.length) {
      setAnalyzedData([]); // Clear old analysis
    }
  };

  return (
    <AppContext.Provider 
      value={{ 
        comments, 
        setComments: handleSetComments, 
        analyzedData, 
        setAnalyzedData 
      }}
    >
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ParserView />} />
            <Route path="/analysis" element={<AnalysisView />} />
          </Routes>
        </Layout>
      </Router>
    </AppContext.Provider>
  );
};

export default App;