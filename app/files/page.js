'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal/page';
import MarkdownRenderer from '@/app/components/MarkdownRenderer/MarkdownRenderer';
import { useModal } from '@/app/hooks/useModal';
import './files.css';

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileDetail, setSelectedFileDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const messageModal = useModal();
  const uploadModal = useModal();
  const reportModal = useModal();
  const [modalMessage, setModalMessage] = useState('');

  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserFiles();
    }
  }, [page, limit, userId]);

  async function checkAuth() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${apiUrl}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const user = await response.json();
      setUserId(user.id);
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err);
      router.push('/login');
    }
  }

  async function fetchUserFiles() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/files/user/${userId}?page=${page}&limit=${limit}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const data = await response.json();
      setFiles(data.files || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 0);
    } catch (err) {
      setModalMessage(`❌ Erro ao carregar arquivos: ${err.message}`);
      messageModal.open();
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);

      const description = document.getElementById('uploadDescription')?.value;
      if (description?.trim()) {
        formData.append('description', description);
      }

      const response = await fetch(`${apiUrl}/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setModalMessage(`✅ Arquivo enviado com sucesso!`);
      messageModal.open();
      setSelectedFile(null);
      uploadModal.close();
      setPage(1);
      fetchUserFiles();
    } catch (err) {
      setModalMessage(`❌ Erro: ${err.message}`);
      messageModal.open();
    } finally {
      setLoading(false);
    }
  }

  async function handleGetFileDetails(fileId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/files/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSelectedFileDetail(data);
    } catch (err) {
      setModalMessage(`❌ Erro: ${err.message}`);
      messageModal.open();
    }
  }

  async function handleDeleteFile(fileId) {
    if (!window.confirm('Tem certeza que deseja deletar este arquivo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao deletar');

      setModalMessage('✅ Arquivo deletado com sucesso!');
      messageModal.open();
      setPage(1);
      fetchUserFiles();
    } catch (err) {
      setModalMessage(`❌ Erro: ${err.message}`);
      messageModal.open();
    }
  }

  async function handleSendToProcessing(fileId) {
    try {
      const token = localStorage.getItem('token');
      
      // Buscar informações do arquivo
      const response = await fetch(`${apiUrl}/files/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const fileData = await response.json();
      if (!response.ok) throw new Error(fileData.message);

      setModalMessage(`⏳ Processando arquivo "${fileData.originalName}"...`);
      messageModal.open();

      // Buscar o arquivo usando o filePath armazenado
      const fileResponse = await fetch(`${apiUrl}${fileData.filePath}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!fileResponse.ok) throw new Error('Erro ao baixar arquivo');

      const fileBlob = await fileResponse.blob();

      // Enviar para processamento no backend Python
      const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8080';
      
      const formData = new FormData();
      formData.append('file', fileBlob, fileData.originalName);

      const processingResponse = await fetch(`${pythonApiUrl}/v1/extract/dxf`, {
        method: 'POST',
        body: formData,
      });

      const processingData = await processingResponse.json();

      if (!processingResponse.ok) {
        throw new Error(processingData.detail || 'Erro ao processar arquivo');
      }

      // Extrair o relatório markdown
      const markdownContent = processingData.relatorio;
      
      if (!markdownContent) {
        throw new Error('Relatório não foi gerado');
      }

      // Salvar o relatório no backend Node.js
      const updateResponse = await fetch(`${apiUrl}/files/${fileId}/markdown`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdownContent: markdownContent,
        }),
      });

      const updateData = await updateResponse.json();
      if (!updateResponse.ok) throw new Error(updateData.message || 'Erro ao salvar relatório');

      // Atualizar o estado local com o novo conteúdo
      setSelectedFileDetail({
        ...selectedFileDetail,
        markdownContent: markdownContent,
      });

      setModalMessage('✅ Arquivo processado com sucesso! Relatório salvo.');
      messageModal.open();
    } catch (err) {
      setModalMessage(`❌ Erro ao processar: ${err.message}`);
      messageModal.open();
    }
  }

  function handlePreviousPage() {
    if (page > 1) setPage(page - 1);
  }

  function handleNextPage() {
    if (page < totalPages) setPage(page + 1);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file && !file.name.toLowerCase().endsWith('.dxf')) {
      setModalMessage('❌ Apenas arquivos .dxf são permitidos');
      messageModal.open();
      e.target.value = '';
      return;
    }
    setSelectedFile(file || null);
  }

  return (
    <main className="files-page main">
      <div className="files-layout">
        <section className="files-container">
          <div className="files-header">
            <h1>Meus Arquivos</h1>
            <button 
              className="btn btn-primary"
              onClick={uploadModal.open}
            >
              + Novo Upload
            </button>
          </div>

          {loading ? (
            <div className="loading">Carregando arquivos...</div>
          ) : files.length === 0 ? (
            <div className="empty-state">
              <p>Você ainda não tem arquivos enviados.</p>
              <button 
                className="btn btn-primary"
                onClick={uploadModal.open}
              >
                Envie seu primeiro arquivo
              </button>
            </div>
          ) : (
            <>
              <div className="files-table-wrapper">
                <table className="files-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome do Arquivo</th>
                      <th>Tamanho</th>
                      <th>Enviado em</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.id}>
                        <td>{file.id}</td>
                        <td>{file.originalName}</td>
                        <td>{(file.fileSize / 1024).toFixed(2)} KB</td>
                        <td>{new Date(file.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td className="actions-cell">
                          <button 
                            className="action-btn detail-btn"
                            onClick={() => handleGetFileDetails(file.id)}
                          >
                            📋 Detalhes
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            🗑️ Deletar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={handlePreviousPage} 
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    ← Anterior
                  </button>
                  <span className="pagination-info">
                    Página {page} de {totalPages}
                  </span>
                  <button 
                    onClick={handleNextPage} 
                    disabled={page === totalPages}
                    className="pagination-btn"
                  >
                    Próxima →
                  </button>
                </div>
              )}

              <div className="files-stats">
                <p>Total de arquivos: <strong>{total}</strong></p>
              </div>
            </>
          )}
        </section>

        {/* Painel Lateral de Detalhes */}
        {selectedFileDetail && (
          <aside className="file-detail-panel">
            <div className="detail-header">
              <h2>Detalhes do Arquivo</h2>
              <button 
                className="close-btn" 
                onClick={() => setSelectedFileDetail(null)}
                title="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="detail-content">
              <div className="detail-group">
                <label>ID:</label>
                <p>{selectedFileDetail.id}</p>
              </div>
              <div className="detail-group">
                <label>Nome do Arquivo:</label>
                <p className="file-name">{selectedFileDetail.originalName}</p>
              </div>
              <div className="detail-group">
                <label>Tamanho:</label>
                <p>{(selectedFileDetail.fileSize / 1024).toFixed(2)} KB</p>
              </div>
              <div className="detail-group">
                <label>Enviado em:</label>
                <p>{new Date(selectedFileDetail.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
              {selectedFileDetail.description && (
                <div className="detail-group">
                  <label>Descrição:</label>
                  <p className="description-text">{selectedFileDetail.description}</p>
                </div>
              )}
              {selectedFileDetail.markdownContent && (
                <div className="detail-group">
                  <label>Relatório:</label>
                  <button 
                    className="btn btn-primary"
                    onClick={reportModal.open}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    👁️ Visualizar Relatório
                  </button>
                </div>
              )}
            </div>

            <div className="detail-actions">
              <button 
                className="action-btn delete-btn"
                onClick={() => {
                  handleDeleteFile(selectedFileDetail.id);
                  setSelectedFileDetail(null);
                }}
              >
                🗑️ Deletar Arquivo
              </button>
              <button 
                className="action-btn"
                onClick={() => handleSendToProcessing(selectedFileDetail.id)}
                style={{ backgroundColor: '#27ae60' }}
              >
                ⚙️ Processar DXF
              </button>
            </div>
          </aside>
        )}

      {/* Modal de Upload */}
      <Modal
        isOpen={uploadModal.isOpen}
        onClose={uploadModal.close}
        title="Novo Upload de Arquivo"
        size="medium"
        footer={
          <>
            <button 
              className="btn-secondary"
              onClick={uploadModal.close}
            >
              Cancelar
            </button>
            <button 
              className="btn-primary"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </>
        }
      >
        <form className="upload-form">
          <div className="form-group">
            <label htmlFor="fileInput" className="file-label">
              Selecione um arquivo .dxf:
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".dxf"
              onChange={handleFileChange}
              className="file-input"
              disabled={loading}
            />
            {selectedFile && (
              <p className="file-selected">
                ✓ Arquivo selecionado: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="uploadDescription">Descrição (opcional):</label>
            <textarea
              id="uploadDescription"
              placeholder="Descreva o conteúdo do arquivo..."
              className="description-input"
              rows="3"
              disabled={loading}
            />
          </div>
        </form>
      </Modal>

      {/* Modal de Mensagem */}
      <Modal
        isOpen={messageModal.isOpen}
        onClose={messageModal.close}
        title="Notificação"
        size="small"
        footer={
          <button 
            className="btn-primary"
            onClick={messageModal.close}
          >
            OK
          </button>
        }
      >
        {modalMessage.includes('{') ? (
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '4px',
            maxHeight: '400px',
            overflowY: 'auto',
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {modalMessage}
          </pre>
        ) : (
          <p>{modalMessage}</p>
        )}
      </Modal>

      {/* Modal de Visualização do Relatório */}
      <Modal
        isOpen={reportModal.isOpen}
        onClose={reportModal.close}
        title="Relatório de Análise DXF"
        size="large"
        footer={
          <button 
            className="btn-primary"
            onClick={reportModal.close}
          >
            Fechar
          </button>
        }
      >
        <div className="report-content" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <MarkdownRenderer content={selectedFileDetail?.markdownContent} />
        </div>
      </Modal>
      </div>
    </main>
  );
}
