'use client'

import { useState } from 'react';
import './upload.css';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.dxf')) {
      setMessage('Apenas arquivos .dxf são permitidos');
      setMessageType('error');
      setFile(null);
      e.target.value = '';
      return;
    }

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

    if (!file.name.toLowerCase().endsWith('.dxf')) {
      setMessage('Apenas arquivos .dxf são permitidos');
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
      if (description.trim()) {
        formData.append('description', description);
      }

      const response = await fetch(`${apiUrl}/files/upload`, {
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
      setDescription('');
      
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
    <main className='main upload-page-main'>
      <section className='upload-page-container'>
        <h1 className='upload-page-title'>Enviar Arquivo CAD</h1>
        
        <div className='upload-section'>
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
                <span className='file-input-icon'>📁</span>
                <span className='file-input-text'>
                  {file ? file.name : 'Clique para selecionar ou arraste um arquivo'}
                </span>
              </label>
            </div>

            {file && (
              <div className='file-info'>
                <p><strong>Arquivo:</strong> {file.name}</p>
                <p><strong>Tamanho:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            <div className='description-wrapper'>
              <label htmlFor='description' className='description-label'>
                Descrição (opcional):
              </label>
              <textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                placeholder='Adicione uma descrição para este arquivo...'
                className='description-input'
                rows='4'
              />
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
