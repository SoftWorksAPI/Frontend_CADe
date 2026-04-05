'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Você precisa estar autenticado para registrar um novo usuário');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao registrar usuário');
      }

      const data = await response.json();
      console.log('Usuário registrado com sucesso:', data);
      router.push('/login?success=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signup-page main">
      <section className="signup-container">
        <h1>Cadastrar</h1>

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            required
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            required
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <label htmlFor="confirmPassword">Confirmar senha</label>
          <input
            id="confirmPassword"
            type="password"
            required
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />

          <div className="signup-actions">
            <button
              type="submit"
              className="submit"
              disabled={!name || !email || !password || !confirmPassword || loading}
            >
              {loading ? "Registrando..." : "Cadastrar"}
            </button>
          </div>
        </form>

        <p className="login-link">
          Já tem uma conta? <Link href="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}