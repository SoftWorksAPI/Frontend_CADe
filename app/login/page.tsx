"use client";
import { useState, FormEvent } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Validação de login
    if (!username || !password) {
      setErro("Preencha todos os campos");
      return;
    }

    if (password.length < 3) {
      setErro("Senha muito curta");
      return;
    }

    // Loading de login
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (username === "admin" && password === "123") {
        setSucesso("Login realizado com sucesso");
      } else {
        setErro("Usuário ou senha incorretos");
      }

    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">

      <div className="w-full max-w-sm bg-white rounded-xl shadow-md border border-slate-200 p-6">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-800">
            Área de Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sistema de Gestão de Projetos CAD
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* USER */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Usuário
            </label>

            <input
              name="username"
              type="text"
              placeholder="Digite seu usuário"
              autoComplete="username"
              className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-300 rounded-md 
              focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Senha
            </label>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                autoComplete="current-password"
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

          {/* ERRO */}
          {erro && (
            <p className="text-red-600 text-sm text-center">
              {erro}
            </p>
          )}

          {/* SUCESSO */}
          {sucesso && (
            <p className="text-green-900 text-sm text-center">
              {sucesso}
            </p>
          )}

          {/* OPTIONS */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="accent-blue-600" />
              Lembrar-me
            </label>

            <a href="#" className="text-blue-600 hover:underline">
              Solicitar nova senha
            </a>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md 
            hover:bg-blue-700 transition font-medium disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>



      </div>
    </div>
  );
}