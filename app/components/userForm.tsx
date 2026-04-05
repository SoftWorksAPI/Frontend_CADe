"use client";

import { useState, useEffect, FormEvent } from "react";
import { User } from "../users/page";

type Props = {
  setUsuarios: React.Dispatch<React.SetStateAction<User[]>>;
  editingUser: User | null;
  setEditingUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export default function UserForm({
  setUsuarios,
  editingUser,
  setEditingUser,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // preencher ao editar
  useEffect(() => {
    if (editingUser) {
      setNome(editingUser.nome);
      setEmail(editingUser.email);
      setSenha(editingUser.senha);
    }
  }, [editingUser]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome || !email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    if (senha.length < 3) {
      setErro("Senha muito curta");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (editingUser) {
        // UPDATE
        setUsuarios((prev) =>
          prev.map((user) =>
            user.id === editingUser.id
              ? { ...user, nome, email, senha }
              : user
          )
        );

        setSucesso("Usuário atualizado com sucesso");
        setEditingUser(null);
      } else {
        // CREATE
        const novoUsuario: User = {
          id: Date.now(),
          nome,
          email,
          senha,
        };

        setUsuarios((prev) => [...prev, novoUsuario]);
        setSucesso("Usuário criado com sucesso");
      }

      setLoading(false);

      setNome("");
      setEmail("");
      setSenha("");
    }, 800);
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-md border border-slate-200 p-6">

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-800">
          {editingUser ? "Editar Usuário" : "Cadastrar Usuário"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Nome
          </label>

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            type="text"
            placeholder="Digite o nome"
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Email
          </label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Digite o email"
            className="w-full px-3 py-2 border border-slate-300  rounded-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Senha
          </label>

          <div className="relative">
            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Digite a senha"
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-xs"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        {sucesso && <p className="text-green-700 text-sm text-center">{sucesso}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {loading
            ? "Processando..."
            : editingUser
            ? "Editar Usuário"
            : "Criar Usuário"}
        </button>

      </form>
    </div>
  );
}