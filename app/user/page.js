'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './user.css';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  if (loading) return <div className="user-page"><p>Carregando...</p></div>;
  if (error) return <div className="user-page"><p style={{ color: 'red' }}>Erro: {error}</p></div>;
  if (!user) return <div className="user-page"><p>Usuário não encontrado</p></div>;

  return (
    <main className="user-page main">
      <section className="user-container">
        <h1>Meu Perfil</h1>

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

        <div className="user-actions">
          <Link href="/chat" className="btn btn-primary">Ir para Chat</Link>
          <button onClick={handleLogout} className="btn btn-logout">Sair</button>
        </div>
      </section>
    </main>
  );
}
