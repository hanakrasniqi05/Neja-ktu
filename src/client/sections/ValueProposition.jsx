export const ValueProposition = () => {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Çfarë Ofrojmë Ne?</h2>
      
      <div className="grid md:grid-cols-2 gap-12">
      
        {/* Kompani */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-sky-200 transform hover:scale-[1.02] transition-all">
          <h3 className="text-2xl font-bold mb-6 text-sky-200  flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Për Kompanitë dhe Organizatorët
          </h3>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="text-sky-300  mr-3 mt-1">✓</span>
              <p><strong>Publikim i lehtë</strong> - Ngarkoni eventet tuaja në pak minuta me platformën tonë intuitive</p>
            </li>
            <li className="flex items-start">
              <span className="text-sky-300  mr-3 mt-1">✓</span>
              <p><strong>Menaxhim i RSVP-ve</strong> - Gjurmoni pjesëmarrjen në kohë reale</p>
            </li>
            <li className="flex items-start">
              <span className="text-sky-300  mr-3 mt-1">✓</span>
              <p><strong>Promovim automatik</strong> - Eventet tuaja shfaqen automatikisht në Instagram dhe Facebook</p>
            </li>
            <li className="flex items-start">
              <span className="text-sky-300  mr-3 mt-1">✓</span>
              <p><strong>Statistika të avancuara</strong> - Analizoni interesimin e përdoruesve me grafikë të detajuar</p>
            </li>
          </ul>
        </div>

      {/* Perdorues */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-300 transform hover:scale-[1.02] transition-all">
          <h3 className="text-2xl font-bold mb-6 text-yellow-300 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Për Përdoruesit
          </h3>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3 mt-1">✓</span>
              <p><strong>Zbuloni evente të reja</strong> - Gjeni koncerte, festivalet dhe aktivitetet më të fundit në Kosovë</p>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3 mt-1">✓</span>
              <p><strong>Rezervim me një klik</strong> - Regjistrohuni për eventet tuaja të preferuara pa asnjë stres</p>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3 mt-1">✓</span>
              <p><strong>Personalizim</strong> - Merrni rekomandime bazuar në preferencat tuaja</p>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3 mt-1">✓</span>
              <p><strong>Aktivitete te famshme</strong> - Ndiqni artistët dhe organizatat tuaja të preferuara</p>
            </li>
          </ul>
        </div>
      </div>


      <div className="mt-16 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-8 text-gray-800">Platforma Jonë në Numra</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "50+", label: "Evente në Muaj" },
            { number: "50,000+", label: "Përdorues Aktivë" },
            { number: "85%", label: "Shkallë Kënaqësie" },
            { number: "10+", label: "Qytete në Kosovë" }
          ].map((stat, index) => (
            <div key={index} className="bg-white/80 p-4 rounded-lg shadow">
              <p className="text-3xl font-bold text-blue-600">{stat.number}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ValueProposition;