import { useNavigate } from 'react-router-dom';
import GradientText from '../../GradientText.jsx';

const HeroHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 w-full flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <GradientText
            colors={["#03045E", "#023E8A","#0077B6","#0096C7","#00B4D8",]}
            animationSpeed={3}
            showBorder={false}
            className="text-5xl md:text-7xl  font-bold leading-tight"
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
      </div>
    </div>
  );
};

export default HeroHeader;