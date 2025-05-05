import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const AboutUs = () => {
  return (
    <>
      <Header />
        <div className="text-center py-8 space-y-6">
            <h2 className="text-4xl font-bold">About Us</h2>
            <h2 className="text-3xl">What we do</h2>
            <h2 className="text-3xl">Why choose us</h2>
            <h2 className="text-3xl">How it works</h2>
            <h2 className="text-3xl">Testimonials</h2>
        </div>
      <Footer />
    </>
  );
};

export default AboutUs;