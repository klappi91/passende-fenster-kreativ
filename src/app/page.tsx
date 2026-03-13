import Hero from "@/components/sections/hero";
import Usp from "@/components/sections/usp";
import FensterSysteme from "@/components/sections/fenster-systeme";
import Dienstleistungen from "@/components/sections/dienstleistungen";
import Konfigurator from "@/components/sections/konfigurator";
import AnfrageForm from "@/components/sections/anfrage-form";
import ScrollAnimations from "@/components/scroll-animations";

export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <Hero />
      <Usp />
      <FensterSysteme />
      <Dienstleistungen />
      <Konfigurator />
      <AnfrageForm />
    </>
  );
}
