import "./globals.css";
import Footer from "./components/footer/page";
import Header from "./components/header/page";
import LayoutWrapper from "./components/LayoutWrapper/page";

export const metadata = {
  title: "CADê",
  description: "Aplicação web para gerar automaticamente documentações técnicas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <LayoutWrapper>
          <Header />
          {children}
          <Footer />
        </LayoutWrapper>
      </body>
    </html>
  );
}
