// import React, { useState, useEffect } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import useClipboard from 'react-use-clipboard';

// const App = () => {
//   const [textToCopy, setTextToCopy] = useState('');
//   const [isCopied, setCopied] = useClipboard(textToCopy, {
//     successDuration: 1000,
//   });
//   const [response, setResponse] = useState('');
//   console.log("res",response);
//   const [listening, setListening] = useState(false);

//   const startListening = () => {const speakResponse = () => {
//     const utterance = new SpeechSynthesisUtterance(response || textToCopy);
  
//     utterance.addEventListener('end', () => {
//       setListening(false); // Stop listening when speech ends
//     });
  
//     window.speechSynthesis.speak(utterance);
  
//     // Error handling
//     utterance.onerror = (event) => {
//       console.error('Speech synthesis error:', event.error);
//     };
//   };
  

//     setListening(true);
//     SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
//   };

//   const stopListening = () => {
//     setListening(false);
//     SpeechRecognition.stopListening();
//   };

//   const speakResponse = () => {
//     console.log("wor");
//     const utterance = new SpeechSynthesisUtterance(response || textToCopy);
  
//     utterance.addEventListener('end', () => {
//       setListening(false); // Stop listening when speech ends
//     });
  
//     window.speechSynthesis.speak(utterance);
  
//     // Error handling
//     utterance.onerror = (event) => {
//       console.error('Speech synthesis error:', event.error);
//     };
//   };
  
  

//   const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

//   // useEffect is called unconditionally
//   useEffect(() => {
//     if (transcript && !listening) {
//       // Send the transcript to the ChatGPT API
//       sendToChatGPT(transcript);
//     }
//   }, [transcript, listening]);

//   const sendToChatGPT = async (inputText) => {
//     // Replace 'YOUR_CHATGPT_API_ENDPOINT' with the actual API endpoint you have
//     const apiUrl = 'YOUR_CHATGPT_API_ENDPOINT';

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ input: inputText }),
//       });

//       const data = await response.json();
//       setResponse(data.output); // Assuming the API response has an 'output' field
//       setTextToCopy(data.output); // Set the response text for copying
//       speakResponse(); // Speak the response when it's received
//     } catch (error) {
//       console.error('Error fetching data from ChatGPT API', error);
//     }
//   };

//   if (!browserSupportsSpeechRecognition) {
//     return null;
//   }

//   return (
//     <>
//       <div className="container">
//         <h2>Speech to ChatGPT</h2>
//         <br />
//         <p>A React app that converts speech to text and communicates with ChatGPT for responses.</p>

//         <div className="main-content" onClick={() => setTextToCopy(response)}>
//           {response || transcript}
//         </div>

//         <div className="btn-style">
//           <button onClick={setCopied}>{isCopied ? 'Copied!' : 'Copy to clipboard'}</button>
//           <button onClick={startListening} disabled={listening}>
//             Start Listening
//           </button>
//           <button onClick={stopListening} disabled={!listening}>
//             Stop Listening
//           </button>
//           <button onClick={speakResponse} disabled={!response}>
//             Speak Response
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default App;
import React, { useState } from 'react'

const Text = () => {
  const[stateis,setstateis]=useState(false)
  console.log("state is",stateis);
  return (
    <div>
      <button onClick={setstateis(true)}>click</button>
    </div>
  )
}

export default Text

