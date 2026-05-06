import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Footer } from "./components/footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white" style={{ scrollBehavior: "smooth" }}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
      </main>
      <Footer />
    </div>
  );
}
