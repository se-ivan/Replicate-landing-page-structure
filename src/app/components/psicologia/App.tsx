import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { About } from "./about";
import { Services } from "./services";
import { Footer } from "./footer";
import { ArticleHighlights } from "../ArticleHighlights";
import type { Article } from "../../../data/articles";

type Props = {
  articles?: Article[];
};

export default function App({ articles = [] }: Props) {
  return (
    <div className="min-h-screen bg-white" style={{ scrollBehavior: "smooth" }}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <ArticleHighlights
          articles={articles}
          eyebrow="Articulos de psicologia"
          title="Recursos para acompanar procesos emocionales."
          description="Lecturas sobre salud mental, vejez, familia y herramientas cotidianas para sostener bienestar con apoyo profesional."
          variant="psicologia"
        />
      </main>
      <Footer />
    </div>
  );
}
