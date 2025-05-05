import {motion} from 'framer-motion';

export const HeroSection = () => {
    return (
        <section className="min-h-screen flex items-center justify-center px-20 bg-gradient-to-r from-sky-200 to-yellow-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}  
          className="text-center text-white max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bashkohu me ngjarjet më të mira në Kosovë!
          </h1>
        </motion.div>
      </section>
    );
  };

  export default HeroSection;