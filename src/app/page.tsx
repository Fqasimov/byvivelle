import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { About } from "@/components/about";
import { Collections } from "@/components/collections";
import { Process } from "@/components/process";
import { Occasions } from "@/components/occasions";
import { Craft } from "@/components/craft";
import { Order } from "@/components/order";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Collections />
        <Process />
        <Occasions />
        <Craft />
        <Order />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
