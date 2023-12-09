import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from 'react-use-clipboard';
import { MdDelete } from "react-icons/md";
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
    setManualInput('')
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

      // Simulate a response with random answers
      const simulateChatGPTResponse = () => {
        const randomResponses = [
          "I'm sorry, I didn't understand that.",
          "Could you please provide more details?",
          "Interesting! Tell me more.",
          "I'm still learning. Can you rephrase your question?",
          "That's a great question! Let me think...",
        ];

        return randomResponses[Math.floor(Math.random() * randomResponses.length)];
      };

      const chatResponse = simulateChatGPTResponse();

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { id: new Date().getTime(), role: 'user', content: userMessage },
        { id: new Date().getTime() + 1, role: 'assistant', content: chatResponse },
      ]);

    } catch (error) {
      console.error(error.message);
      setError('Error communicating with ChatGPT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = (messageId) => {
    setChatHistory((prevHistory) => prevHistory.filter((message) => message.id !== messageId));
  };

  const deleteConversation = () => {
    setChatHistory([]);
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="container">
      <h2>Voice Chat with Chatbot</h2>
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
      <div className='text-center'>
        <button onClick={deleteConversation} className='hover'>
          <MdDelete className='del' />
          
        </button>
      </div>




      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="chat-history">
        {chatHistory.map((message) => (
          <div key={message.id} className={message.role}>
            {message.content}
            <span className="delete-icon" onClick={() => deleteMessage(message.id)}>
            <MdDelete className='del' />
            </span>
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
