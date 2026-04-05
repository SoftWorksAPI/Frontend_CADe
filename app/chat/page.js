'use client';

import "./chat.css";
import { useState, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello!', sender: 'server' },
    { id: 2, text: 'Hi there!', sender: 'user' },
    { id: 3, text: 'How are you?', sender: 'server' }
  ]);

  const [input, setInput] = useState('');
  const fileInputRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    setTimeout(() => {
      const serverResponse = {
        id: Date.now() + 1,
        text: 'Mensagem recebida!',
        sender: 'server'
      };

      setMessages((prev) => [...prev, serverResponse]);
    }, 1000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newMessage = {
      id: Date.now(),
      text: `📎 ${file.name}`,
      sender: 'user',
      file: file
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <main className='main chat-page'>
      <div className='chat-container'>
        <div className='chat-header'>
          <h1 className='title-chat'>Chat</h1>
        </div>

        <div className='messages'>
          {messages.map(message => {
            const isUser = message.sender === 'user';

            return (
              <div
                key={message.id}
                className={`message ${isUser ? 'sent' : 'received'}`}
              >
                {message.text}
              </div>
            );
          })}
        </div>

        <div className='input-container'>
          <input className="text-input"
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Digite uma mensagem...'
          />

          <div className='buttons-container'>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <button className=" buttons upload-button" onClick={handleUploadClick}>+</button>
          
            <button className="buttons send-button" onClick={sendMessage}>Enviar</button>

          </div>
        </div>
      </div>
    </main>
  );
}