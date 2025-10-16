import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TechStack } from "./components/TechStack";
import { Projects } from "./components/Projects";
import { Community } from "./components/Community";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TechStack />
        <Projects />
        <Community />
      </main>
      <Footer />
    </div>
  );
}