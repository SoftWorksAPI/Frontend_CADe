'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup'];
  
  // Rotas que precisam de autenticação
  const protectedRoutes = ['/user', '/chat', '/admin'];

  useEffect(() => {
    checkAccess();
  }, [pathname]);

  async function checkAccess() {
    try {
      // Se é rota pública, permite acesso
      if (publicRoutes.includes(pathname)) {
        setShowContent(true);
        setIsLoading(false);
        return;
      }

      // Para outras rotas, verifica autenticação
      const token = localStorage.getItem('token');

      if (!token) {
        // Se não tem token e é rota protegida, redireciona para login
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          router.push('/login');
          return;
        }
      }

      setShowContent(true);
    } catch (err) {
      console.error('Erro ao verificar acesso:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!showContent) {
    return null;
  }

  return <>{children}</>;
}
