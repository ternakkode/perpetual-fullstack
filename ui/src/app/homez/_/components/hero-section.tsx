import { HeroMessage } from "./(hero-section)/hero-message";
import { HeroPicture } from "./(hero-section)/hero-picture";

export const HeroSection = () => {
  return (
    <section id="hero" className="relative pt-16 md:pt-5 md:pb-16 lg:pb-[72px]">
      <HeroMessage />
      <article className="mt-14 md:mt-20 md:mx-10 lg:mx-[72px]">
        <HeroPicture />
      </article>
    </section>
  );
};
