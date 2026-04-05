"use client";

import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { User } from "../users/page";

type Props = {
  setUsuarios: Dispatch<SetStateAction<User[]>>;
};

export default function UserForm({ setUsuarios }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const formData = new FormData(e.currentTarget);
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const senha = formData.get("senha") as string;

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
      const novoUsuario: User = {
        id: Date.now(),
        nome,
        email,
        senha,
      };

      setUsuarios((prev) => [...prev, novoUsuario]);

      setSucesso("Usuário criado com sucesso");
      setLoading(false);

      (e.target as HTMLFormElement).reset();
    }, 400);
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-md border border-slate-200 p-6">

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-800">
          Cadastro de Usuário
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Nome
          </label>

          <input
            name="nome"
            type="text"
            placeholder="Digite o nome"
            className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-300 rounded-md 
            focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Email
          </label>

          <input
            name="email"
            type="email"
            placeholder="Digite o email"
            className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-300 rounded-md 
            focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Senha
          </label>

          <div className="relative">
            <input
              name="senha"
              type={showPassword ? "text" : "password"}
              placeholder="Digite a senha"
              className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-300 rounded-md 
              focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-xs text-slate-500 hover:text-black"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        {erro && (
          <p className="text-red-600 text-sm text-center">
            {erro}
          </p>
        )}

        {sucesso && (
          <p className="text-green-700 text-sm text-center">
            {sucesso}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md 
          hover:bg-blue-700 transition font-medium disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar Usuário"}
        </button>

      </form>
    </div>
  );
}