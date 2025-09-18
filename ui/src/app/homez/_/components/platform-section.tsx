import { PlatformGlobe } from "./(platform-section)/platform-globe";
import { PlatformGradient } from "./(platform-section)/platform-gradient";
import { PlatformMock } from "./(platform-section)/platform-mock";
import { SectionHeader } from "./_/section-header";

export const PlatformSection = () => {
  return (
    <section id="platform" className="relative py-16 md:py-0">
      <PlatformGlobe />
      <div className="absolute top-1/2 -translate-y-1/2 -inset-x-4 md:-inset-x-14 lg:-inset-x-[120px] flex flex-col gap-[46px] md:gap-[120px]">
        <SectionHeader
          title={
            <span>
              Built on <br /> Hyperliquid
            </span>
          }
          message={
            <span>
              The leading decentralized exchange for <br />
              secure and seamless trading.
            </span>
          }
        />
        <PlatformMock />
      </div>
      <PlatformGradient />
    </section>
  );
};
