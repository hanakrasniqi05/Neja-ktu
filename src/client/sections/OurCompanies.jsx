import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function OurCompanySection() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/companies/top");
        const data = await res.json();
        if (data.success) {
          setCompanies(data.companies);
        }
      } catch (err) {
        console.error("Error fetching top companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <section className="py-12 px-4 mt-24">
      <h2 className="text-4xl text-very-dark-blue font-bold text-center mb-16">
        Famous Companies
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
        {companies.map((company, idx) => (
          <div
            key={idx}
            className="w-48 p-4 border rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={company.image}
              alt={company.name}
              className="w-full h-24 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold text-center">
              {company.name}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              {company.events}
            </p>
          </div>
        ))}
      </div>

      <Link
        to="/company-signup"
        className="mt-16 flex justify-center items-center space-x-2 text-lg font-medium text-blue-600 cursor-pointer hover:underline"
      >
        <span>Je kompani dhe dëshiron t’i postosh dhe ti evenetet?</span>
        <ArrowRight />
      </Link>
    </section>
  );
}
