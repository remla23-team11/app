import React, { useCallback, useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { VersionUtil } from '@remla23-team11/lib/src/util/VersionUtil.js'
import GithubMarkWhiteSVG from './github-mark-white.svg'
import './App.css';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [isPositiveResult, setIsPositiveResult] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [typingTimer, setTypingTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [versionUtil] = useState<VersionUtil>(new VersionUtil());
  const [feedback, setFeedback] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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
    clearTimeout(typingTimer);
    setText(inputText);
    setIsChanged(!!inputText);
  };

  const handleFeedbackSelection = (feedback: string) => {
    setFeedback(feedback);
  };

  const submitFeedback = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;  // Get the API URL from environment variable
    setShowAnalysis(false)
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
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  
  
  // useEffect(() => {
  //   if (isChanged) {
  //     setTypingTimer(setTimeout(async () => {
  //       await makeAPICall();
  //       setIsChanged(false);
  //     }, 5000));
  //   }
  // }, [isChanged, makeAPICall]);

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
      {showAnalysis && ( // Only show the analysis radio buttons when showAnalysis is true
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
      {feedback && <button onClick={submitFeedback}>Submit</button>}
      <div className="App-result">
        
        <button onClick={handlePredictClick} disabled={!isChanged}>
          Predict
        </button>
        {isPositiveResult ? <p>🙂</p> : <p>🙁</p>}
      </div>

      {/* <div className="App-result">
        {isChanged ?
          <div style={{ marginTop: "-10px" }}>
            <ClipLoader
              color="#2a3757"
              size={36}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div> :
          isPositiveResult ? <>🙂</> : <>🙁</>
        }
      </div> */}


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
