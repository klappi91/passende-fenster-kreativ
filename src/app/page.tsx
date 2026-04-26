import Hero from "@/components/sections/hero";
import Usp from "@/components/sections/usp";
import FensterSysteme from "@/components/sections/fenster-systeme";
import Konfigurator from "@/components/sections/konfigurator";
import Dienstleistungen from "@/components/sections/dienstleistungen";
import Decors from "@/components/sections/decors";
import AnfrageForm from "@/components/sections/anfrage-form";
import ScrollAnimations from "@/components/scroll-animations";

export default function Home() {
  return (
    <main id="main">
      <ScrollAnimations />
      <Hero />
      <Usp />
      <FensterSysteme />
      <Konfigurator />
      <Dienstleistungen />
      <Decors />
      <AnfrageForm />
    </main>
  );
}
