'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './user.css';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isChangingPasswordLoading, setIsChangingPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', content: '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao carregar dados do usuário');
        }

        const data = await response.json();
        setUser(data);
        setEditFormData({ name: data.name });
        
        // Buscar arquivos do usuário
        fetchUserFiles(data.id, token);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  async function fetchUserFiles(userId, token) {
    try {
      setFilesLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/files/user/${userId}?page=1&limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Erro ao carregar arquivos:', err);
    } finally {
      setFilesLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  function openEditMode() {
    setIsEditingProfile(true);
    setMessage({ type: '', content: '' });
  }

  function cancelEdit() {
    setIsEditingProfile(false);
    setEditFormData({ name: user.name });
    setMessage({ type: '', content: '' });
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    
    if (!editFormData.name.trim()) {
      setMessage({ type: 'error', content: 'Nome é obrigatório' });
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${apiUrl}/users/update/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar perfil');
      }

      setUser(data);
      setIsEditingProfile(false);
      setMessage({ type: 'success', content: '✅ Perfil atualizado com sucesso!' });
      
      setTimeout(() => {
        setMessage({ type: '', content: '' });
      }, 3000);
    } catch (err) {
      setMessage({ type: 'error', content: `❌ Erro: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  }

  function openChangePasswordMode() {
    setIsChangingPassword(true);
    setPasswordFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordMessage({ type: '', content: '' });
  }

  function cancelChangePassword() {
    setIsChangingPassword(false);
    setPasswordFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordMessage({ type: '', content: '' });
    setShowOldPassword(false);
    setShowNewPassword(false);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    
    if (!passwordFormData.oldPassword.trim()) {
      setPasswordMessage({ type: 'error', content: 'Senha atual é obrigatória' });
      return;
    }

    if (!passwordFormData.newPassword.trim()) {
      setPasswordMessage({ type: 'error', content: 'Nova senha é obrigatória' });
      return;
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordMessage({ type: 'error', content: 'As senhas não coincidem' });
      return;
    }

    setIsChangingPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${apiUrl}/users/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: user.id,
          oldPassword: passwordFormData.oldPassword,
          newPassword: passwordFormData.newPassword
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao alterar senha');
      }

      setIsChangingPassword(false);
      setPasswordFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMessage({ type: 'success', content: '✅ Senha alterada com sucesso!' });
      
      setTimeout(() => {
        setPasswordMessage({ type: '', content: '' });
      }, 3000);
    } catch (err) {
      setPasswordMessage({ type: 'error', content: `❌ Erro: ${err.message}` });
    } finally {
      setIsChangingPasswordLoading(false);
    }
  }
  if (error) return <div className="user-page"><p style={{ color: 'red' }}>Erro: {error}</p></div>;
  if (!user) return <div className="user-page"><p>Usuário não encontrado</p></div>;

  return (
    <main className="user-page main">
      <section className="user-container">
        <div className="profile-header">
          <h1>🔐 Meu Perfil</h1>
          {!isEditingProfile && !isChangingPassword && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-edit"
                onClick={openEditMode}
                title="Editar nome"
              >
                ✏️ Editar Nome
              </button>
              <button 
                className="btn-edit"
                onClick={openChangePasswordMode}
                title="Alterar senha"
                style={{ backgroundColor: '#e74c3c' }}
              >
                🔐 Alterar Senha
              </button>
            </div>
          )}
        </div>

        {message.content && (
          <div className={`message-box ${message.type}`}>
            {message.content}
          </div>
        )}

        {passwordMessage.content && (
          <div className={`message-box ${passwordMessage.type}`}>
            {passwordMessage.content}
          </div>
        )}

        {isEditingProfile ? (
          <form className="edit-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                disabled={isSaving}
                required
              />
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn-save"
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={cancelEdit}
                disabled={isSaving}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : isChangingPassword ? (
          <form className="edit-form" onSubmit={handleChangePassword}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label>Senha Atual:</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, fontWeight: 'normal' }}>
                  <input 
                    type="checkbox" 
                    checked={showOldPassword}
                    onChange={(e) => setShowOldPassword(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>👁️</span>
                </label>
              </div>
              <input
                type={showOldPassword ? "text" : "password"}
                value={passwordFormData.oldPassword}
                onChange={(e) => setPasswordFormData({ ...passwordFormData, oldPassword: e.target.value })}
                disabled={isChangingPasswordLoading}
                placeholder="Digite sua senha atual"
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label>Nova Senha:</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, fontWeight: 'normal' }}>
                  <input 
                    type="checkbox" 
                    checked={showNewPassword}
                    onChange={(e) => setShowNewPassword(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>👁️</span>
                </label>
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordFormData.newPassword}
                onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                disabled={isChangingPasswordLoading}
                placeholder="Digite sua nova senha"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmar Nova Senha:</label>
              <input
                type="password"
                value={passwordFormData.confirmPassword}
                onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                disabled={isChangingPasswordLoading}
                placeholder="Confirme sua nova senha"
                required
              />
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn-save"
                disabled={isChangingPasswordLoading}
                style={{ backgroundColor: '#e74c3c' }}
              >
                {isChangingPasswordLoading ? 'Alterando...' : 'Alterar Senha'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={cancelChangePassword}
                disabled={isChangingPasswordLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="user-info">
            <div className="info-group">
              <label>ID:</label>
              <p>{user.id}</p>
            </div>

            <div className="info-group">
              <label>Nome:</label>
              <p>{user.name}</p>
            </div>

            <div className="info-group">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>

            <div className="info-group">
              <label>Tipo de Conta:</label>
              <p>{user.isAdmin ? 'Administrador' : 'Usuário'}</p>
            </div>

            <div className="info-group">
              <label>Criado em:</label>
              <p>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="info-group">
              <label>Última atualização:</label>
              <p>{new Date(user.updatedAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        )}

        <div className="user-files-section">
          <h2>Meus Arquivos</h2>
          {filesLoading ? (
            <p className="files-loading">Carregando arquivos...</p>
          ) : files.length === 0 ? (
            <p className="files-empty">Você ainda não tem arquivos enviados.</p>
          ) : (
            <div className="files-table-wrapper">
              <table className="files-table">
                <thead>
                  <tr>
                    <th>Nome do Arquivo</th>
                    <th>Tamanho</th>
                    <th>Enviado em</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td>{file.originalName}</td>
                      <td>{(file.fileSize / 1024).toFixed(2)} KB</td>
                      <td>{new Date(file.createdAt).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="user-actions">
          <Link href="/chat" className="btn btn-primary">Ir para Chat</Link>
          <button onClick={handleLogout} className="btn btn-logout">Sair</button>
        </div>
      </section>
    </main>
  );
}
