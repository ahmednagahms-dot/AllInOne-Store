import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Footer from "../components/layout/Footer";

function Home() {
return (
    <div className="min-h-screen bg-[#F8FAFC]">

        <Navbar />

        <main>
        <Hero />

        {/* باقي أقسام الـ Home هنضيفها هنا */}
        </main>

        <Footer />

    </div>
    );
}

export default Home;