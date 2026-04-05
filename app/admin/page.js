'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './admin.css';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editFormData, setEditFormData] = useState({ name: '', isAdmin: false });
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [page, limit, isAdmin]);

  async function checkAdminAccess() {
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
        router.push('/login');
        return;
      }

      const user = await response.json();
      
      if (!user.isAdmin) {
        router.push('/');
        return;
      }

      setIsAdmin(true);
    } catch (err) {
      console.error('Erro ao verificar acesso:', err);
      router.push('/login');
    }
  }

  async function fetchUsers() {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/users/list?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao carregar usuários');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  function handlePreviousPage() {
    if (page > 1) setPage(page - 1);
  }

  function handleNextPage() {
    if (page < totalPages) setPage(page + 1);
  }

  async function handleRegisterUser(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao registrar usuário');
      }

      setFormData({ name: '', email: '', password: '' });
      setShowRegisterModal(false);
      fetchUsers();
      alert('Usuário registrado com sucesso!');
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  }

  async function handleEditUser(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${apiUrl}/users/update/${editingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao atualizar usuário');
      }

      setEditingUser(null);
      setShowEditModal(false);
      fetchUsers();
      alert('Usuário atualizado com sucesso!');
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${apiUrl}/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao deletar usuário');
      }

      fetchUsers();
      alert('Usuário deletado com sucesso!');
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  }

  function openEditModal(user) {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      isAdmin: user.isAdmin
    });
    setShowEditModal(true);
  }

  if (loading) return <div className="admin-page"><p>Carregando...</p></div>;
  if (!isAdmin) return null;
  if (error) return <div className="admin-page"><p style={{ color: 'red' }}>Erro: {error}</p></div>;

  return (
    <main className="admin-page main">
      <section className="admin-container">
        <h1>Painel de Administração</h1>
        <p className="admin-subtitle">Total de usuários: {total}</p>

        {users.length === 0 ? (
          <p>Nenhum usuário encontrado</p>
        ) : (
          <>
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Criado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? '👑 Admin' : '👤 Usuário'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="actions-cell">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => openEditModal(user)}
                        >
                          Editar
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
          </>
        )}

        <div className="admin-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowRegisterModal(true)}
          >
            + Novo Usuário
          </button>
          <Link href="/user" className="btn btn-primary">Meu Perfil</Link>
          <button onClick={handleLogout} className="btn btn-logout">Sair</button>
        </div>

        {/* Modal Registrar Usuário */}
        {showRegisterModal && (
          <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Registrar Novo Usuário</h2>
              <form onSubmit={handleRegisterUser}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <div className="modal-buttons">
                  <button type="submit" className="btn-modal-submit">Registrar</button>
                  <button 
                    type="button" 
                    className="btn-modal-cancel"
                    onClick={() => setShowRegisterModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar Usuário */}
        {showEditModal && editingUser && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Editar Usuário</h2>
              <form onSubmit={handleEditUser}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editFormData.isAdmin}
                    onChange={(e) => setEditFormData({ ...editFormData, isAdmin: e.target.checked })}
                  />
                  Tornar Admin
                </label>
                <div className="modal-buttons">
                  <button type="submit" className="btn-modal-submit">Atualizar</button>
                  <button 
                    type="button" 
                    className="btn-modal-cancel"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}