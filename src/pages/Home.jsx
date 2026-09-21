import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import OfferBanner from "../components/home/OfferBanner";
import BestSellers from "../components/home/BestSellers";
import WhyShopWithUs from "../components/home/WhyShopWithUs";
import CustomerReviews from "../components/home/CustomerReviews";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <OfferBanner />
      <BestSellers />
      <WhyShopWithUs />
      <CustomerReviews />
      <Newsletter />
    </div>
  );
}