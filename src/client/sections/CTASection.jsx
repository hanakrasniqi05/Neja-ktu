export const CTASection = () => {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Bashkohu me Komunitetin Tonë</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kompani */}
            <div className="bg-white p-8 rounded-xl shadow-md border-2 border-yellow-100 hover:border-yellow-200 transition-all">
              <div className="text-center">
                <div className="mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Për Kompanitë</h3>
                <p className="text-gray-600 mb-6">Regjistro kompaninë tënde dhe fillo të organizosh ngjarje!</p>
                <button className="company-btn relative bg-yellow-300 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:text-white">
                  Regjistro Kompaninë
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>
            </div>
  
            {/* Perdorues */}
            <div className="bg-white p-8 rounded-xl shadow-md border-2 border-sky-100 hover:border-sky-200 transition-all">
              <div className="text-center">
                <div className="mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Për Përdoruesit</h3>
                <p className="text-gray-600 mb-6">Regjistrohu dhe shijo të gjitha ngjarjet në qytetin tënd!</p>
                <button className="user-btn relative bg-sky-300 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:text-white">
                  Regjistrohu Si Përdorues
                  <span className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <style jsx>{`
          .company-btn:hover {
            background: linear-gradient(45deg, #FFD700, #FFA500, #FF8C00);
            box-shadow: 0 0 15px rgba(255, 165, 0, 0.6);
          }
          
          .user-btn:hover {
            background: linear-gradient(45deg, #1E90FF, #4169E1, #0000FF);
            box-shadow: 0 0 15px rgba(30, 144, 255, 0.6);
          }
          
          button {
            overflow: hidden;
            position: relative;
            z-index: 1;
          }
          
          button span {
            z-index: -1;
          }
        `}</style>
      </section>
    );
  };
  
  export default CTASection;