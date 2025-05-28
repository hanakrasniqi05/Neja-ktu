import { useNavigate } from 'react-router-dom';
import GradientText from '../../GradientText.jsx';
import videoFile from '../assets/Kosovomapvid.mp4'; 

const HeroHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <video
        className="hidden md:block absolute top-0 right-0 h-screen w-6/12 object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoFile} type="video/mp4" />
      </video>

      <div className="md:hidden flex flex-col items-center justify-center px-6 py-12 gap-6">
        <div className="w-full text-center z-10">
          <GradientText
            colors={["#03045E", "#023E8A", "#0077B6", "#0096C7", "#00B4D8"]}
            animationSpeed={3}
            showBorder={false}
            className="text-4xl font-bold leading-tight"
          >
            Eventet më të mira në Kosovë, të gjitha në një vend.
          </GradientText>

          <button
            onClick={() => navigate('/events')}
            className="mt-8 px-6 py-3 bg-blue hover:bg-dark-blue text-white text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Shko tek eventet
          </button>
        </div>

        <video
          className="w-full h-auto object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoFile} type="video/mp4" />
        </video>
      </div>

      <div className="hidden md:flex relative z-10 max-w-7xl mx-auto px-8 w-full flex-row items-center justify-center gap-8 min-h-screen">
        <div className="w-full md:w-2/5 text-left z-10">
          <GradientText
            colors={["#03045E", "#023E8A", "#0077B6", "#0096C7", "#00B4D8"]}
            animationSpeed={3}
            showBorder={false}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Eventet më të mira në Kosovë, të gjitha në një vend.
          </GradientText>

          <button
            onClick={() => navigate('/events')}
            className="mt-12 px-8 py-4 bg-blue hover:bg-dark-blue text-white text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Shko tek eventet
          </button>
        </div>
        <div className="w-full md:w-3/5" />
      </div>
    </div>
  );
};

export default HeroHeader;
