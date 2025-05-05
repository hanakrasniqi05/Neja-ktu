import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

const companies = [
  {
    name: "Google",
    events: "5 Active Events",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Amazon",
    events: "3 Active Events",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    name: "Microsoft",
    events: "7 Active Events",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    name: "Meta",
    events: "2 Active Events",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fblog.logomyway.com%2Fmeta-logo%2F&psig=AOvVaw2CqU08eIRkoAqHEVUg0Pux&ust=1746031382961000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJjhhfXX_YwDFQAAAAAdAAAAABAE",
  },
];

export default function OurCompanySection() {
  return (
    <section className="py-12 px-4 mt-24">
      <h2 className="text-4xl text-black font-bold text-center mb-16">Famous Companies</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
        {companies.map((company, idx) => (
          <div key={idx} className="w-48 p-4 border rounded-lg shadow hover:shadow-lg transition">
            <img
              src={company.image}
              alt={company.name}
              className="w-full h-24 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold text-center">{company.name}</h3>
            <p className="text-sm text-gray-600 text-center">{company.events}</p>
          </div>
        ))}
      </div>

        <Link to="/sign-up" className="mt-16 flex justify-center items-center space-x-2 text-lg font-medium text-blue-600 cursor-pointer hover:underline">
            <span>Je kompani dhe dëshiron t’i postosh dhe ti evenetet?</span>
            <ArrowRight />
        </Link>
    </section>
  );
}
