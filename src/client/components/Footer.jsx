import { Link } from 'react-router-dom';
import logo from '../assets/logo-pin-b.png'; 

const Footer = () => {
  return (
    <div className="relative mt-24">
      <div className="absolute inset-x-0 top-0 h-24 pointer-events-none"style={{background:'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',}}/>
      <footer className="bg-very-light-blue w-full py-12 pt-28 text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
            <div className="flex-shrink-0 text-center md:text-left">
              <img
                src={logo}
                alt="Eventet në Kosovë"
                className="h-28 sm:h-32 md:h-40 w-auto mx-auto md:mx-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
            <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="flex flex-col space-y-2"> <h3 className="font-bold text-lg mb-2">Kompania</h3>
                <Link to="/" className="hover:underline hover:text-gray-700 transition">Faqja Kryesore</Link>
                <Link to="/events" className="hover:underline hover:text-gray-700 transition">Eventet</Link>
                <Link to="/about-us" className="hover:underline hover:text-gray-700 transition">Rreth Nesh</Link>
              </div>

              <div className="flex flex-col space-y-2">
                <h3 className="font-bold text-lg mb-2">Dokumentacion</h3>
                <a
                  href="https://github.com/hanakrasniqi05/Neja-ktu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-gray-700 transition"
                >
                  GitHub Repository
                </a>
                <a href="https://trello.com/b/BhUJHNwu/neja-ktu" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-gray-700 transition">Trello</a>
              </div>

              <div className="flex flex-col space-y-2">
                <h3 className="font-bold text-lg mb-2">Studentët</h3>
                <a href="mailto:hk69945@ubt-uni.net" className="hover:underline hover:text-gray-700 transition">Hana Krasniqi</a>
                <a href="mailto:fh70112@ubt-uni.net" className="hover:underline hover:text-gray-700 transition">Fortesa Halitaj</a>
                <a href="mailto:fe69995@ubt-uni.net" className="hover:underline hover:text-gray-700 transition">Florenta Elezi</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-black text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Eventet Kosovë – Projekt universitar i zhvilluar duke përdorur React, Node.js dhe MySQL.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
