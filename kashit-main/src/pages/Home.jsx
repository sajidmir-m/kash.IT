import Header from "../components/Header";
import Promise from "../components/promise";
import Hero from "../components/hero";
import WhyChoose from "../components/WhyChoose";
import FeaturedProducts from "../components/FeaturedProducts";
import KashmiriSpecialties from "../components/KashmiriSpecialties";
import WeatherRecommendations from "../components/WeatherRecommendations";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      {/* Categories */}
      <Hero />
      {/* Promise banner */}
      <Promise />
      {/* Featured Products */}
      <FeaturedProducts />
      {/* Kashmiri Specialties */}
      <KashmiriSpecialties />
      {/* Why Choose */}
      <WhyChoose />
      {/* Weather Based Recommendations */}
      <WeatherRecommendations />
      <Footer />
    </>
  );
}
