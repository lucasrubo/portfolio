import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Blog from "@/components/Blog";
import ClickSpark from "@/components/ClickSpark";

const Index = () => {
  return (
    <ClickSpark
      sparkColor="#00bfff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="min-h-screen bg-background overflow-x-hidden">
        <NavBar />
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Projects />
        <Certificates />
        <Contact />
        <Footer />
      </div>
    </ClickSpark>
  );
};

export default Index;
