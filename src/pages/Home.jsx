import Header from "../components/Header";
import Promise from "../components/promise";
import Hero from "../components/hero";
import WhyChoose from "../components/WhyChoose";
import WeatherRecommendations from "../components/WeatherRecommendations";
import Footer from "../components/Footer";
import FeaturedProducts from "../components/FeaturedProducts";

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
      {/* Why Choose */}
      <WhyChoose />
      {/* Weather Based Recommendations */}
      <WeatherRecommendations />
      <Footer />
    </>
  );
}
