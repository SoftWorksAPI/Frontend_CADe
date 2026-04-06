'use client'

import { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal/page';
import { useModal } from '@/app/hooks/useModal';
import './test.css';

export default function FilesTestPage() {
  const [files, setFiles] = useState([]);
  const [userFiles, setUserFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [markdownFileId, setMarkdownFileId] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');

  const messageModal = useModal();
  const fileDetailModal = useModal();
  const [modalMessage, setModalMessage] = useState('');
  const [selectedFileDetail, setSelectedFileDetail] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Obter ID do usuário ao montar
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function fetchCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const user = await response.json();
      setUserId(user.id);
    } catch (err) {
      console.error('Erro ao obter usuário:', err);
    }
  }

  // Upload de arquivo
  async function handleUpload(e) {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${apiUrl}/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setModalMessage(`✅ Upload bem-sucedido!\nID: ${data.file.id}`);
      messageModal.open();
      setSelectedFile(null);
      listAllFiles();
    } catch (err) {
      setModalMessage(`❌ Erro: ${err.message}`);
      messageModal.open();
    } finally {
      setLoading(false);
    }
  }

  // Listar todos os arquivos
  async function listAllFiles() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/files?page=${page}&limit=${limit}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      setFiles(data.files);
    } catch (err) {
      setModalMessage(`❌ Erro ao listar: ${err.message}`);
      messageModal.open();
    } finally {
      setLoading(false);
    }
  }

  // Listar arquivos do usuário
  async function listUserFiles() {
    if (!userId) {
      setModalMessage('❌ ID do usuário não disponível');
      messageModal.open();
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/files/user/${userId}?page=${page}&limit=${limit}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      setUserFiles(data.files);
    } catch (err) {
      setModalMessage(`❌ Erro ao listar: ${err.message}`);
      messageModal.open();
    } finally {
      setLoading(false);
    }
  }

  // Obter arquivo por ID
  async function handleGetFileById(fileId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/files/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSelectedFileDetail(data);
      fileDetailModal.open();
    } catch (err) {
      setModalMessage(`❌ Erro: ${err.message}`);
      messageModal.open();
    }
  }

  // Deletar arquivo
  async function handleDeleteFile(fileId) {
    if (!window.confirm('Tem certeza?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao deletar');

      setModalMessage('✅ Arquivo deletado com sucesso!');
      messageModal.open();
      listAllFiles();
      listUserFiles();
    } catch (err) {
      setModalMessage(`❌ Erro: ${err.message}`);
      messageModal.open();
    }
  }

  // Enviar markdown para um arquivo
  async function handleAddMarkdown(e) {
    e.preventDefault();
    
    if (!markdownFileId.trim()) {
      setModalMessage('❌ ID do arquivo é obrigatório');
      messageModal.open();
      return;
    }

    if (!markdownContent.trim()) {
      setModalMessage('❌ Conteúdo do markdown é obrigatório');
      messageModal.open();
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/files/${markdownFileId}/markdown`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ markdownContent }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Erro ao adicionar markdown');

      setModalMessage(
        `✅ Markdown adicionado com sucesso!\n\n` +
        `Arquivo ID: ${data.file.id}\n` +
        `Nome: ${data.file.originalName}\n` +
        `Atualizado em: ${new Date(data.file.updatedAt).toLocaleDateString('pt-BR')}`
      );
      messageModal.open();
      
      setMarkdownFileId('');
      setMarkdownContent('');
    } catch (err) {
      setModalMessage(`❌ Erro: ${err.message}`);
      messageModal.open();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="test-page-main">
      <div className="test-container">
        <h1>🧪 Página de Teste - Arquivos</h1>
        <p className="info-text">Seu ID: {userId}</p>

        {/* Seção de Upload */}
        <section className="test-section">
          <h2>📤 Upload de Arquivo</h2>
          <form onSubmit={handleUpload} className="test-form">
            <input
              type="file"
              accept=".dxf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              required
            />
            {selectedFile && <p>Arquivo: {selectedFile.name}</p>}
            <button 
              type="submit" 
              disabled={!selectedFile || loading}
              className="test-btn primary"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </section>

        {/* Seção Listar Todos */}
        <section className="test-section">
          <h2>📋 Listar Todos os Arquivos</h2>
          <div className="controls">
            <button 
              onClick={listAllFiles} 
              disabled={loading}
              className="test-btn"
            >
              Listar
            </button>
            <div className="pagination-controls">
              <input
                type="number"
                min="1"
                value={page}
                onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                placeholder="Página"
              />
              <input
                type="number"
                min="1"
                max="50"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
                placeholder="Limite"
              />
            </div>
          </div>

          {files.length > 0 && (
            <div className="files-list">
              {files.map((file) => (
                <div key={file.id} className="file-item">
                  <div className="file-info">
                    <strong>{file.originalName}</strong>
                    <p>ID: {file.id} | Tamanho: {(file.fileSize / 1024).toFixed(2)} KB</p>
                    <p>Usuário: {file.User?.name} ({file.User?.email})</p>
                    <p>Criado: {new Date(file.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="file-actions">
                    <button 
                      onClick={() => handleGetFileById(file.id)}
                      className="test-btn info"
                    >
                      Ver Detalhes
                    </button>
                    <button 
                      onClick={() => handleDeleteFile(file.id)}
                      className="test-btn danger"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção Listar por Usuário */}
        <section className="test-section">
          <h2>👤 Listar Meus Arquivos</h2>
          <div className="controls">
            <button 
              onClick={listUserFiles}
              disabled={!userId || loading}
              className="test-btn"
            >
              Listar Meus Arquivos
            </button>
          </div>

          {userFiles.length > 0 && (
            <div className="files-list">
              {userFiles.map((file) => (
                <div key={file.id} className="file-item">
                  <div className="file-info">
                    <strong>{file.originalName}</strong>
                    <p>ID: {file.id} | Tamanho: {(file.fileSize / 1024).toFixed(2)} KB</p>
                    <p>Criado: {new Date(file.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="file-actions">
                    <button 
                      onClick={() => handleGetFileById(file.id)}
                      className="test-btn info"
                    >
                      Ver Detalhes
                    </button>
                    <button 
                      onClick={() => handleDeleteFile(file.id)}
                      className="test-btn danger"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção de Teste - Adicionar Markdown */}
        <section className="test-section">
          <h2>📝 Adicionar Markdown a um Arquivo</h2>
          <form onSubmit={handleAddMarkdown} className="test-form">
            <input
              type="text"
              placeholder="ID do arquivo"
              value={markdownFileId}
              onChange={(e) => setMarkdownFileId(e.target.value)}
              required
            />
            <textarea
              placeholder="Conteúdo markdown..."
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              rows="6"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="test-btn primary"
            >
              {loading ? 'Adicionando...' : 'Adicionar Markdown'}
            </button>
          </form>
        </section>
      </div>

      {/* Modal de Mensagem */}
      <Modal
        isOpen={messageModal.isOpen}
        onClose={messageModal.close}
        title="Teste de Arquivos"
        size="small"
        footer={<button className="btn-primary" onClick={messageModal.close}>OK</button>}
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>{modalMessage}</p>
      </Modal>

      {/* Modal de Detalhes do Arquivo */}
      <Modal
        isOpen={fileDetailModal.isOpen}
        onClose={fileDetailModal.close}
        title="Detalhes do Arquivo"
        size="medium"
        footer={<button className="btn-primary" onClick={fileDetailModal.close}>Fechar</button>}
      >
        {selectedFileDetail && (
          <div className="file-details">
            <p><strong>ID:</strong> {selectedFileDetail.id}</p>
            <p><strong>Nome:</strong> {selectedFileDetail.originalName}</p>
            <p><strong>Arquivo:</strong> {selectedFileDetail.filename}</p>
            <p><strong>Caminho:</strong> {selectedFileDetail.filePath}</p>
            <p><strong>Tamanho:</strong> {(selectedFileDetail.fileSize / 1024).toFixed(2)} KB</p>
            <p><strong>Descrição:</strong> {selectedFileDetail.description || 'N/A'}</p>
            <p><strong>Usuário:</strong> {selectedFileDetail.User?.name} ({selectedFileDetail.User?.email})</p>
            <p><strong>Criado:</strong> {new Date(selectedFileDetail.createdAt).toLocaleDateString('pt-BR')}</p>
            <p><strong>Atualizado:</strong> {new Date(selectedFileDetail.updatedAt).toLocaleDateString('pt-BR')}</p>
          </div>
        )}
      </Modal>
    </main>
  );
}
