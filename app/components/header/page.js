'use client'

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import "../../globals.css";
import "./header.css";
import Link from "next/link";
import Image from "next/image";

export default function Header () {
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Rotas onde não mostrar header
    const hideHeaderRoutes = ['/login', '/signup'];
    const shouldHideHeader = hideHeaderRoutes.includes(pathname);

    useEffect(() => {
        checkUserStatus();
        
        // Monitora mudanças no localStorage (quando faz login/logout)
        const handleStorageChange = () => {
            checkUserStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Também monitora quando o pathname muda
        checkUserStatus();
        
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [pathname]);

    async function checkUserStatus() {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setIsAuthenticated(false);
                setIsAdmin(false);
                setLoading(false);
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

            if (response.ok) {
                const user = await response.json();
                setIsAuthenticated(true);
                setIsAdmin(user.isAdmin);
            } else {
                setIsAuthenticated(false);
                setIsAdmin(false);
            }
        } catch (err) {
            console.error('Erro ao verificar status:', err);
            setIsAuthenticated(false);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsAdmin(false);
        window.location.href = '/login';
    }

    // Não renderizar header em rotas públicas de autenticação
    if (shouldHideHeader) {
        return null;
    }

    return (
        <header className="header">
            <Link href="/" >
                <div className="logo">
                    <Image src="/icon.svg" alt="Logo" width={50} height={50} />
                    <h1>CADê</h1>
                </div>
            </Link>
            <nav className="pages-menu">
                <ul className="pages-list">
                    {!loading && isAdmin && (
                        <li className="pages-item"> <Link href="/admin"> <h1>Painel</h1> </Link></li>
                    )}
                    {!loading && isAuthenticated && (
                        <li className="pages-item"> <Link href="/chat"> <h1>Chat</h1> </Link></li>
                    )}
                    {!loading && isAuthenticated && (
                        <li className="pages-item"> <Link href="/files"> <h1>Arquivos</h1> </Link></li>
                    )}
                    {!loading && isAuthenticated && (
                        <li className="pages-item"> <Link href="/user"> <h1>Perfil</h1> </Link></li>
                    )}
                </ul>
            </nav>
            <nav className="user-menu">
                <ul className="user-list">
                    {!loading && (
                        <>
                            {isAuthenticated ? (
                                <li className="user-item" id="logout-button" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55 58 200-200-200-200Z"/></svg>
                                    <h1>Sair</h1>
                                </li>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <li className="user-item" id="login-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
                                            <h1 id="login">Entrar</h1>
                                        </li>
                                    </Link>
                                    <Link href="/signup">
                                        <li className="user-item" id="sign-up-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff8f0"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-640Zm0 400Z"/></svg>
                                            <h1 id="sign-up">Cadastrar</h1>
                                        </li>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </ul>
            </nav>
        </header>
    )
}