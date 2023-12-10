import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MdDelete } from "react-icons/md";
import useClipboard from 'react-use-clipboard';
import { FaVolumeHigh } from "react-icons/fa6";
import { FaVolumeXmark } from "react-icons/fa6";
import { ThreeDots } from 'react-loader-spinner'
import Sidebar from './Sidebar';

import './App.css';

const apiUrl = 'https://www.chatbase.co/api/v1/chat';

const App = () => {
  const [textToCopy, setTextToCopy] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

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

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 272f571d-4481-4c88-a100-1368bf7a7443',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: userMessage },
          ],
          chatbotId: 'hn8S7aaqSd8_slDFjFZZS',
          stream: false,
          model: 'gpt-3.5-turbo',
          temperature: 0
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      const chatResponse = responseData.text;
      speakText(chatResponse)


      setChatHistory((prevHistory) => [

        { role: 'user', content: userMessage },
        { role: 'assistant', content: chatResponse },
        ...prevHistory,
      ]);

    } catch (error) {
      console.error('Error communicating with Chatbase:', error);
      setError('Error communicating with Chatbase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    let newText = new SpeechSynthesisUtterance();
    newText.text = text;

    window.speechSynthesis.speak(newText);
  };



  const deleteLastMessages = () => {

    setChatHistory([]);
  };
  const deleteMessage = (index) => {

    const updatedChatHistory = [...chatHistory];

    updatedChatHistory.splice(index, 1);

    setChatHistory(updatedChatHistory);
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="container row">

      <h2>Voice Chat with Kwan Leung</h2>
      <div className="main-content ">

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
        <button className='text-center ' style={{ backgroundColor: "#db4c44" }} onClick={deleteLastMessages}>
          <MdDelete />
        </button>
      </div>

      {isLoading && <div className="loading-indicator text-center"><ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#4fa94d"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      /></div>}
      {error && <div className="error-message">{error}</div>}

      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div key={index} className={message.role} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div >

              <span style={{ flex: 1 }}>{message.content}</span>
            </div>
            <div className='chat-icon'>

              <span onClick={() => speakText(message.content)} style={{ cursor: "pointer", marginLeft: '10px' }}>
                <FaVolumeHigh />
              </span>
              <span onClick={() => deleteMessage(index)} style={{ cursor: "pointer", marginLeft: '10px' }}>
                <MdDelete />
              </span>
            </div>
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
