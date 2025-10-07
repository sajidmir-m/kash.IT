import { ArrowRight } from "lucide-react";
import groceryImg from "../assets/grocery.jpg";
import smartHomeImg from "../assets/smart-home.jpeg";
import iotImg from "../assets/iot.jpg";
import smalltoolsImg from "../assets/smalltools.jpeg";
import webbg from "../assets/webbg.jpg";

export default function FeaturedProducts() {
  const products = [
    { id: "groceries", name: "Groceries", image: groceryImg, price: "From ₹199" },
    { id: "smart-home", name: "Smart Home", image: smartHomeImg, price: "From ₹1,499" },
    { id: "iot-tools", name: "IoT Tools", image: iotImg, price: "From ₹899" },
    { id: "small-tools", name: "Small Tools", image: smalltoolsImg, price: "From ₹249" },
  ];

  return (
    <section
      className="py-12 px-6 lg:px-12 bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${webbg})` }}
    > {/* padding applied at section level */}
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <a
          href="/products"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          View All
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>

      {/* Horizontal scroll row (same alignment as hero) */}
      {/* Marquee row */}
      <div className="relative overflow-hidden pb-2">
        <div className="flex items-center space-x-4 marquee-track">
          {[...products, ...products].map((p, idx) => (
            <div
              key={`${p.id}-${idx}`}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col items-center p-3 flex-shrink-0 w-24"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-white">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="mt-2 text-xs font-semibold text-gray-800 text-center leading-tight">{p.name}</h3>
              <a href={`/products?category=${p.id}`} className="mt-1 inline-flex items-center text-green-600 hover:text-green-700 text-xs font-medium">
                Explore
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track {
              width: max-content;
              animation: marquee 25s linear infinite;
            }
            @media (min-width: 768px) {
              .marquee-track { animation-duration: 30s; }
            }
            @media (min-width: 1024px) {
              .marquee-track { animation-duration: 35s; }
            }
          `}
        </style>
      </div>
    </section>
  );
}
