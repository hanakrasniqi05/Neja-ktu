import { Link } from 'react-router-dom';
import logo from '../assets/logo-pin-b.png'; 

const Footer = () => {
  return (
    <div className="relative mt-24"> 
      <div 
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
        }}
      ></div>
      
      <footer className="bg-very-light-blue w-full py-12 pt-28 text-black">
        <div className="container mx-auto px-6">
          <div className="w-full max-w-7xl mx-auto flex flex-wrap md:flex-nowrap justify-between items-start gap-6">
            <div className="flex-shrink-0 mr-8">
              <img 
                src={logo} 
                alt="Eventet në Kosovë"
                className="h-40 w-auto mb-4" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/150'; 
                }}
              />
            </div>

            <div className="flex justify-between gap-8 w-full md:w-auto">
              <div className="flex flex-col space-y-2 max-w-[150px]">
                <h3 className="font-bold text-lg mb-2">Kompania</h3>
                <Link to="/" className="hover:underline text-black hover:text-gray-700 transition">Faqja Kryesore</Link>
                <Link to="/events" className="hover:underline text-black hover:text-gray-700 transition">Eventet</Link>
                <Link to="/about" className="hover:underline text-black hover:text-gray-700 transition">Rreth Nesh</Link>
              </div>

              <div className="flex flex-col space-y-2 max-w-[150px]">
                <h3 className="font-bold text-lg mb-2">Burime</h3>
                <Link to="/blog" className="hover:underline text-black hover:text-gray-700 transition">Blog</Link>
                <Link to="/help" className="hover:underline text-black hover:text-gray-700 transition">Ndihma</Link>
                <Link to="/tutorials" className="hover:underline text-black hover:text-gray-700 transition">Tutoriale</Link>
              </div>

              <div className="flex flex-col space-y-2 max-w-[150px]">
                <h3 className="font-bold text-lg mb-2">Kontakt</h3>
                <a href="tel:044123456" className="hover:underline text-black hover:text-gray-700 transition">044-123-456</a>
                <a href="mailto:ubt@uni.net" className="hover:underline text-black hover:text-gray-700 transition">ubt@uni.net</a>
                <a href="mailto:ubt2@uni.net" className="hover:underline text-black hover:text-gray-700 transition">ubt2@uni.net</a>
              </div>
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto mt-12 pt-6 border-t border-black text-center">
            <p className="text-sm text-black">
              © {new Date().getFullYear()} Eventet Kosovë. Të gjitha të drejtat e rezervuara.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
