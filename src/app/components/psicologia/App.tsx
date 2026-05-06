import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { About } from "./about";
import { Services } from "./services";
import { Footer } from "./footer";

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
