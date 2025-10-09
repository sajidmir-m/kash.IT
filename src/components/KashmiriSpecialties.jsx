import { ArrowRight } from "lucide-react";
import saffronImg from "../assets/saffron.jpg";
import walnutsImg from "../assets/walnuts.jpg";
import almondsImg from "../assets/almonds.jpg";
import khewaImg from "../assets/khewa.jpg";
import noonChaiImg from "../assets/noonchai.jpg";
import honeyImg from "../assets/honey.jpg";

export default function KashmiriSpecialties() {
  const items = [
    { id: "saffron", name: "Saffron (Kesar)", image: saffronImg },
    { id: "walnuts", name: "Walnuts", image: walnutsImg },
    { id: "almonds", name: "Almonds", image: almondsImg },
    { id: "kahwa", name: "Khwae Cahi (Kahwa)", image: khewaImg },
    { id: "noon-chai", name: "Noon Cahi (Pink Tea)", image: noonChaiImg },
    { id: "honey", name: "Honey", image: honeyImg },
  ];

  return (
    <section className="bg-white py-12 px-6 lg:px-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kashmiri Specialties</h2>
        <a
          href="/kashmiri-specialties"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          View All
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>

      {/* Marquee row */}
      <div className="relative overflow-hidden">
        <div className="flex items-center space-x-4 marquee-track">
          {[...items, ...items].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col items-center p-3 flex-shrink-0 w-24"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-white">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="mt-2 text-xs font-semibold text-gray-800 text-center leading-tight">{item.name}</h3>
              <a
                href={`/products?special=${item.id}`}
                className="mt-1 inline-flex items-center text-green-600 hover:text-green-700 text-xs font-medium"
              >
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










