import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="text-white rounded-t-3xl shadow-inner"
      style={{
        background: 'linear-gradient(90deg, rgba(209,250,229,0.95) 0%, rgba(252,231,243,0.95) 100%)'
      }}
    >
      <div className="w-full px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Kashmir Quick Commerce */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Kashmir Quick Commerce</h3>
            <p className="text-green-100 text-base leading-relaxed">
              10-minute delivery of groceries, fresh produce, and daily essentials across Srinagar.  
              Powered by KASHIT's proven quick commerce technology with Kashmir-specific adaptations.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="text-green-200 hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="text-green-800 text-sm pt-2">
              © 2025 Kashmir Quick Commerce. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "All Products", href: "/products" },
                { name: "Kashmiri Specialties", href: "/kashmiri-specialties" },
                { name: "Groceries", href: "/groceries" },
                { name: "Fresh Produce", href: "/fresh-produce" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-green-800 hover:text-green-900 transition-colors text-base font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-green-700 mt-1 flex-shrink-0" />
                <p className="text-green-800 text-base leading-relaxed">
                  Lal Chowk, Srinagar, Jammu & Kashmir, 190001
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-green-700 flex-shrink-0" />
                <a
                  href="mailto:support@kashmirquickcommerce.com"
                  className="text-green-800 hover:text-green-900 transition-colors text-base font-medium"
                >
                  support@kashmirquickcommerce.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6 text-green-700 flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="text-green-800 hover:text-green-900 transition-colors text-base font-medium"
                >
                  +91 1234567890
                </a>
              </div>
            </div>
            <p className="text-green-800 text-sm pt-4">
              Powered by KASHIT's Technology
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
