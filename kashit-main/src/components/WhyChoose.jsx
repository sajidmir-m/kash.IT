import { Zap, Building, Truck, Tag } from "lucide-react";

export default function WhyChoose() {
  const reasons = [
    { 
      title: "10-Minute Delivery", 
      desc: "Ultra-fast delivery across Srinagar city, even to narrow lane areas.",
      icon: Zap,
      iconColor: "text-green-600"
    },
    { 
      title: "Dark Stores Network", 
      desc: "Strategically located dark stores ensure fresh products and quick delivery.",
      icon: Building,
      iconColor: "text-green-600"
    },
    { 
      title: "Local Riders", 
      desc: "Our riders know every corner of Srinagar, ensuring timely delivery even in tourist areas.",
      icon: Truck,
      iconColor: "text-green-600"
    },
    { 
      title: "Kashmiri Specialties", 
      desc: "Authentic local products from trusted vendors across the Kashmir Valley.",
      icon: Tag,
      iconColor: "text-green-600"
    }
  ];

  return (
    <section className="bg-white py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6 px-4 sm:px-6 lg:px-8">Why Choose KASHIT?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8">
        {reasons.map((reason, idx) => {
          const IconComponent = reason.icon;
          return (
            <div key={idx} className="bg-green-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-700 rounded-lg">
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-1">{reason.title}</h3>
              <p className="text-white/90 text-sm md:text-base leading-relaxed">{reason.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
