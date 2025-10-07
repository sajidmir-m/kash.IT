import { Link } from "react-router-dom";
import stationeryImg from "../assets/stationery.jpeg";
import soapDetergentShampooImg from "../assets/soapdetergent&shampo.jpeg";
import homeEssentialsImg from "../assets/homeessentionals.jpeg";
import { ArrowRight } from "lucide-react";
import fruitsVeg from "../assets/fruits-and-veg.jpeg";
import dairy from "../assets/dairy.jpeg";
import dalAata from "../assets/dal-aata.jpeg";
import tools from "../assets/smalltools.jpeg";
import masala from "../assets/masala.jpeg";
import teaCoffee from "../assets/tea-coffee.jpeg";
import biscuits from "../assets/buscuits.jpeg";
import chips from "../assets/chips.jpeg";
import juiceColdDrink from "../assets/juicesandcolddrins.jpeg";
import iceCream from "../assets/ice-cream.jpeg";
import smartHomeImg from "../assets/smart-home.jpeg";
import chocolateCandy from "../assets/chocolate & candy.jpeg";
import kidsCare from "../assets/kidscare.jpeg";
import feminineHygiene from "../assets/feminine-hygiene.jpeg";
import iotTools from "../assets/iot-tools.jpeg";

export default function Hero() {
  const categories = [
    { name: "Fruits & Vegetables", image: fruitsVeg },
    { name: "Chips", image: chips },
    { name: "Dairy, Bread & Eggs", image: dairy },
    { name: "Atta, Rice, Sugar, Oil & Dals", image: dalAata },
    { name: "Masala & Dry Fruits", image: masala },
    { name: "Juice & Cold Drink", image: juiceColdDrink },
    { name: "Biscuits", image: biscuits },
    // Newly inserted middle categories
    { name: "Stationery", image: stationeryImg },
    { name: "Soap, Detergents & Shampoo", image: soapDetergentShampooImg },
    { name: "Home Essentials", image: homeEssentialsImg },
    { name: "Tea, Coffee & More", image: teaCoffee },
    { name: "Ice Creams & More", image: iceCream },
    { name: "Smart Home", image: smartHomeImg },
    { name: "Tools", image: tools },
    { name: "Chocolates, Chew Gums & Candy", image: chocolateCandy },
    { name: "Kids Care", image: kidsCare },
    { name: "Feminine Hygiene", image: feminineHygiene },
    { name: "IoT Tools", image: iotTools },
  ];

  return (
    <>
      <style jsx>{`
        .hero-scroll-container::-webkit-scrollbar {
          height: 8px;
        }
        .hero-scroll-container::-webkit-scrollbar-track {
          background: #E5E7EB;
          border-radius: 4px;
        }
        .hero-scroll-container::-webkit-scrollbar-thumb {
          background: #9CA3AF;
          border-radius: 4px;
        }
        .hero-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
      <section className="hero-section py-6 bg-white">
        <div 
          className="hero-scroll-container flex items-start space-x-6 overflow-x-auto pb-2 pl-4 pr-4 w-full"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#9CA3AF #E5E7EB'
          }}
        >
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center justify-center flex-shrink-0 w-28 h-40 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3"
            style={{ minWidth: '112px', minHeight: '160px' }}
          >
            {/* Image Container */}
            <div 
              className="rounded-full overflow-hidden shadow-sm border border-gray-300 bg-white mb-3 flex-shrink-0"
              style={{ width: '121px', height: '121px' }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="hero-category-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=Image";
                }}
              />
            </div>
            
            {/* Category Name */}
            <div className="w-full flex items-center justify-center mb-3">
              <span className="text-sm text-gray-700 font-medium text-center leading-tight px-1">
                {cat.name}
              </span>
            </div>
            
            {/* Explore Button */}
            <div className="w-full flex items-center justify-center">
              <Link
                to={cat.name === "Atta, Rice, Sugar, Oil & Dals" ? "/category/atta-rice-oil-dals" : `/category/${cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-").replace(/,/g, "").replace(/&/g, "")}`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors duration-300 shadow-sm"
                aria-label={`Explore ${cat.name} category`}
              >
                Explore
                <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
        </div>
      </section>
    </>
  );
}
