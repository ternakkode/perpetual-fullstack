import Image from "next/image";

import { CtaMessage } from "./(cta-section)/cta-message";
import { CtaPattern } from "./(cta-section)/cta-pattern";

import Bitcoin from "../assets/bitcoin.png";
import Etherium from "../assets/etherium.png";

export const CtaSection = () => {
  return (
    <section id="cta" className="md:px-14">
      <div className="relative bg-[radial-gradient(47.5%_62.53%_at_29.71%_8.75%,#88DDD2_0%,#289A8B_100%)] overflow-hidden md:rounded-2xl">
        <CtaPattern />

        <Image
          alt="Bitcoin"
          className="absolute z-[0] left-0 bottom-0 -translate-x-1/2 translate-y-1/2 md:-translate-x-[30%] md:translate-y-[30%] lg:-translate-x-0 size-[360px] mix-blend-luminosity rotate-[-25deg] pointer-events-none"
          draggable={false}
          src={Bitcoin}
        />

        <CtaMessage />

        <Image
          alt="Etherium"
          className="absolute z-[0] right-0 top-0 translate-x-[55%] -translate-y-[20%] md:translate-x-[45%] md:-translate-y-[20%] lg:translate-x-0 size-[280px] mix-blend-luminosity rotate-[18deg] pointer-events-none"
          draggable={false}
          src={Etherium}
        />
      </div>
    </section>
  );
};
