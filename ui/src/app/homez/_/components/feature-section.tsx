import { FeatureBento } from "./(feature-section)/feature-bento";
import { SectionHeader } from "./_/section-header";

export const FeatureSection = () => {
  return (
    <section
      id="feature"
      className="relative py-16 px-4 md:py-[100px] md:px-14 lg:p-[120px]"
    >
      <div className="container mx-auto flex flex-col gap-12 md:gap-[72px]">
        <SectionHeader
          title={
            <span>
              Advanced Trading
              <br />
              Powerful Features
            </span>
          }
          message={
            <span>
              Unlock next-level trading with multi-asset orders, <br /> 
              relative strategies, and thousands of pairs.
            </span>
          }
        />
        <FeatureBento />
      </div>
    </section>
  );
};
