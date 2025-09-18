import { FaqGradient } from "./(faq-section)/faq-gradient";
import { FaqList } from "./(faq-section)/faq-list";
import { SectionHeader } from "./_/section-header";

export const FaqSection = () => {
  return (
    <section
      id="faq"
      className="relative py-16 px-4 md:py-20 md:px-14 lg:py-[100px] lg:px-[240px]"
    >
      <FaqGradient />
      <div className="relative z-[1] container mx-auto flex flex-col justify-center gap-12 md:gap-[72px]">
        <SectionHeader
          title={<span>FAQ</span>}
          message={
            <span>
              Find answers to common questions <br /> about our platform.
            </span>
          }
        />
        <FaqList />
      </div>
    </section>
  );
};
