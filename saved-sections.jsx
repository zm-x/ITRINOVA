// SAVED SECTIONS FOR LATER USE

// Built for LEO Professionals Section
const LEOProfessionalsSection = ({ isDarkMode }) => (
  <section className={`relative z-10 py-20 px-8 lg:px-12 xl:px-16 ${isDarkMode ? 'bg-gray-900/70' : 'bg-gray-50/70'} backdrop-blur-sm`}>
    <div className="max-w-7xl mx-auto">
      <h3 className={`text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-16 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Built for LEO Professionals
      </h3>
      <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
        <div className={`p-8 lg:p-10 rounded-xl ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}>
          <h4 className={`text-2xl lg:text-3xl font-semibold mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Verified Profiles
          </h4>
          <p className={`text-lg lg:text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Connect with verified professionals in satellite operations, microgravity research, and orbital manufacturing.
          </p>
        </div>
        <div className={`p-8 lg:p-10 rounded-xl ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}>
          <h4 className={`text-2xl lg:text-3xl font-semibold mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            NASA Certifications
          </h4>
          <p className={`text-lg lg:text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Access NASA-backed courses and certifications to advance your LEO career prospects.
          </p>
        </div>
        <div className={`p-8 lg:p-10 rounded-xl ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}>
          <h4 className={`text-2xl lg:text-3xl font-semibold mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            ITAR Compliance
          </h4>
          <p className={`text-lg lg:text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Find opportunities that match your regulatory status and security clearance level.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export { LEOProfessionalsSection };
