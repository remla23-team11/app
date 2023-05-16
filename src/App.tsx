import React, { useCallback, useState } from 'react';
import { VersionUtil } from '@remla23-team11/lib/src/util/VersionUtil.js'
import GithubMarkWhiteSVG from './github-mark-white.svg'
import './App.css';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [isPositiveResult, setIsPositiveResult] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [versionUtil] = useState<VersionUtil>(new VersionUtil());
  const [feedback, setFeedback] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false); // New state variable

  const makeAPICall = useCallback(async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "msg": text }),
      });
      const data = await response.json();
      setIsPositiveResult(data.predictions[0] > 0.5);
    } catch (error) {
      console.error('Error making API call:', error);
    }
  }, [text]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    setText(inputText);
    setIsChanged(!!inputText);
  };

  const handleFeedbackSelection = (feedback: string) => {
    setFeedback(feedback);
  };

  const submitFeedback = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;  // Get the API URL from environment variable
    try {
      await fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "msg": text, "feedback": feedback }),
      });
      // Update any necessary state variables or perform other actions
      setFeedback(''); // Reset feedback to empty string
      setShowAnalysis(false)
      setText('')
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setFeedback(''); // Reset feedback to empty string
      setShowAnalysis(false)
      setText('')
    }
  };
  

  const handlePredictClick = () => {
    makeAPICall();
    setShowAnalysis(true); // Set showAnalysis to true when "Predict" button is clicked
  };

  return (
    <div className="App">
      <h1 className="App-header">Restaurant review sentiment analysis</h1>
      <textarea
        value={text}
        className="App-review"
        onChange={handleInputChange}
        placeholder="Type something..."
      />
      {text && showAnalysis && ( // Only show the analysis radio buttons when showAnalysis is true
        <div className="App-feedback">
          <label>
            <input
              type="radio"
              value="correct"
              checked={feedback === 'correct'}
              onChange={() => handleFeedbackSelection('correct')}
            />{' '}
            This analysis is correct
          </label>
          <label>
            <input
              type="radio"
              value="incorrect"
              checked={feedback === 'incorrect'}
              onChange={() => handleFeedbackSelection('incorrect')}
            />{' '}
            This analysis is incorrect
          </label>
        </div>
      )}
      {text && feedback && 
        <button 
          style={{ margin: "25px 0"}} 
          onClick={submitFeedback}
        >
          Submit
        </button>}
      {text && (
        <>
          <button 
            style={{ margin: "25px 0"}} 
            onClick={handlePredictClick} 
            disabled={!isChanged}
          >
            Analyze
          </button> 
          <div className="App-result">
              {isPositiveResult ? <p>🙂</p> : <p>🙁</p>}
          </div>
        </>
      )}

      <div className="App-footer">
        <a href="https://github.com/remla23-team11" target="_blank" rel="noopener noreferrer">
          <img className="App-icon" src={GithubMarkWhiteSVG} alt="Github" />
        </a>
        <span>Version {versionUtil.version}</span>
      </div>
    </div>
  );
}

export default App;
