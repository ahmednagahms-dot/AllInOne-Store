import Navbar from "../../components/ui/layout/Navbar";
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import OfferBanner from "../../components/home/OfferBanner";
import BestSellers from "../../components/home/BestSellers";
import WhyShopWithUs from "../../components/home/WhyShopWithUs";
import Footer from "../../components/ui/layout/Footer";
import CustomerReviews from "../../components/home/CustomerReviews";
import Newsletter from "../../components/home/Newsletter";
function Home() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />

        <main>
            <Hero />
            <Categories />
            <FeaturedProducts />
            <OfferBanner />
            <BestSellers />
            <WhyShopWithUs />
            <CustomerReviews/>
            <Newsletter/>
        </main>

        <Footer />
        </div>
    );
}

export default Home;