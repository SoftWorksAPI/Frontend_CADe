'use client'

import { usePathname } from 'next/navigation';
import "../../globals.css";
import "./footer.css";

export default function Footer () {
    const pathname = usePathname();

    // Rotas onde não mostrar footer
    const hideFooterRoutes = ['/login', '/signup'];
    const shouldHideFooter = hideFooterRoutes.includes(pathname);

    if (shouldHideFooter) {
        return null;
    }

    return (
        <footer className="footer">
            <p>&copy; 2026 CADê Frontend. Todos os direitos reservados.</p>
        </footer>
    )

}