import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const genAi = new GoogleGenerativeAI('AIzaSyCDlCpViCC3QgPCThe0A2YmAXd4Mo8VgtM');

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [contest,setcontests] = useState([]);

  const model = genAi.getGenerativeModel({
    model: 'gemini-1.5-flash'
  });

  useEffect(() => {
    axios.get("https://code-quest-backend.onrender.com/api/v1/contest/getcontests",{
      withCredentials: true
    }).then((res)=>{
      setcontests(res.data.contests);

    }).catch(()=>{

    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    
  }, [])
  const contestDetails = contest.map(e => `Title: ${e.title}, Start Time: ${e.startTime}`).join('\n');
console.log(contestDetails)

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');


    const prompt = `
    ${input} 
    
   
    `;
    
    // Endpoints Are:
    // - Login: [Login](http://localhost:3000/login)
    // - Signup: [Signup](http://localhost:3000/register)
    // - Leaderboard: [Leaderboard](http://localhost:3000/leaderboard)
    // - Contest participate page or main page: [Main](http://localhost:3000/#main_container)
    // - Create contest page: [Create Contest](http://localhost:3000/create)
    
    // All contest details (in India time zone):
    // ${contestDetails}


    // behave like chatbot
    
    const res = await model.generateContent(prompt);
    const responseText = res.response.text();

    setMessages([...messages, { text: input, sender: 'user' }, { text: responseText, sender: 'bot' }]);
  };

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#007bff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '30px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </div>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            width: '500px',
            padding: '10px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
            Instead of Searching in Google or Chat GPT search here
          <div style={{ maxHeight: '400px', overflowY: 'scroll', padding: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                <p
                  style={{
                    background: msg.sender === 'user' ? '#e1ffc7' : '#f1f1f1',
                    display: 'inline-block',
                    padding: '10px',
                    borderRadius: '10px',
                    margin: '5px 0',
                  }}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', display: 'flex' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, padding: '10px' }}
            />
            <button onClick={handleSend} style={{ padding: '10px 20px', marginLeft: '10px', color: 'white', backgroundColor: 'royalblue', border: 'none' }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
