import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Stats, Marquee } from "@/components/sections/stats-marquee";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Stack } from "@/components/sections/stack";
import { Work } from "@/components/sections/work";
import { Process } from "@/components/sections/process";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { SectionScroller } from "@/components/ui/section-scroller";

/** The whole one-page site. `section` is set on /about, /work… so it opens scrolled there. */
export function Site({ section }: { section?: string }) {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Marquee />
        <About />
        <Services />
        <Stack />
        <Work />
        <Process />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <SectionScroller section={section} />
    </>
  );
}
