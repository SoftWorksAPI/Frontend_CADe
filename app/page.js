'use client'

import { useState } from 'react';
import "./globals.css";
import "./home.css";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setMessage('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!file) {
      setMessage('Por favor selecione um arquivo');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao enviar arquivo');
      }

      const data = await response.json();
      setMessage('Arquivo enviado com sucesso!');
      setMessageType('success');
      setFile(null);
      
      // Reseta o input
      const input = document.getElementById('fileInput');
      if (input) input.value = '';
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='main'>
      <h1 className='title-home'>Página de Inicio</h1>
      
      <section className='upload-section'>
        <div className='upload-container'>
          <h2>Enviar Arquivo CAD</h2>
          
          <form onSubmit={handleSubmit} className='upload-form'>
            <div className='file-input-wrapper'>
              <label htmlFor='fileInput' className='file-input-label'>
                <input
                  id='fileInput'
                  type='file'
                  onChange={handleFileChange}
                  disabled={loading}
                  className='file-input'
                />
                <span className='file-input-text'>
                  {file ? file.name : 'Selecione um arquivo ou clique aqui'}
                </span>
              </label>
            </div>

            <button 
              type='submit' 
              disabled={!file || loading}
              className='upload-button'
            >
              {loading ? 'Enviando...' : 'Enviar Arquivo'}
            </button>
          </form>

          {message && (
            <p className={`upload-message ${messageType}`}>
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
