import "./globals.css";
import Footer from "./components/footer/page";
import Header from "./components/header/page";

export default function Home() {

  return (
    <>
        <Header />
        
        <main className='main'>
          <h1 className='title-home'>Página de Inicio</h1>
        </main>

        <Footer />
    </>
  )
}