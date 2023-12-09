import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from 'react-use-clipboard';
import './App.css'; // Import your CSS file for styling

const App = () => {
  const [textToCopy, setTextToCopy] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [isVoiceTranscribed, setIsVoiceTranscribed] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleManualInputChange = (event) => {
    setManualInput(event.target.value);
    setIsVoiceTranscribed(false);
  };

  const handleManualInputSubmit = async () => {
    setTextToCopy(manualInput);
    setIsVoiceTranscribed(false);
    await processChatGPTMessage(manualInput);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      setIsVoiceTranscribed(false);
    }
  };

  const clearText = () => {
    setManualInput('');
    resetTranscript();
    setIsVoiceTranscribed(false);
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    setIsVoiceTranscribed(true);
  };

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setManualInput(transcript);
  }, [transcript]);

  const processChatGPTMessage = async (userMessage) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://docs.chatbase.co/docs/message-a-chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 272f571d-4481-4c88-a100-1368bf7a7443',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: "how are you" },
          ],
        }),
      });
      console.log("response is :",response);

      if (!response.ok) {
        throw new Error('Error sending message to Chatbot');
      }

      const responseData = await response.json();
      const chatResponse = responseData.choices[0].message.content;

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: chatResponse },
      ]);

    } catch (error) {
      console.error('Error communicating with ChatGPT:', error);
      setError('Error communicating with ChatGPT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="container">
      <h2>Voice Chat with ChatGPT</h2>
      <div className="main-content">
        <input
          type="text"
          placeholder="Speak or Type your message"
          value={manualInput}
          onChange={handleManualInputChange}
          onKeyDown={handleKeyDown}
          className={isVoiceTranscribed ? 'voice-transcribed' : ''}
        />
        <button onClick={handleManualInputSubmit}>Submit</button>
        <button onClick={clearText}>Clear</button>
      </div>

      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div key={index} className={message.role}>
            {message.content}
          </div>
        ))}
      </div>

      <div className="btn-style">
        <button onClick={setCopied}>{isCopied ? 'Copied!' : 'Copy to clipboard'}</button>
        <button onClick={startListening}>Start Listening</button>
        <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
      </div>
    </div>
  );
};

export default App;
