import { ResponsivePicture } from "../_/responsive-picture";

import HyperliquidMockDesktop from "../../assets/hyperliquid-mock-desktop.png";
import HyperliquidMockMobile from "../../assets/hyperliquid-mock-mobile.png";
import HyperliquidMockTablet from "../../assets/hyperliquid-mock-tablet.png";

export const PlatformMock = () => {
  return (
    <figure className="h-[400px] md:h-[440px] lg:h-[460px]">
      <ResponsivePicture
        alt="Built on Hyperliquid"
        className="absolute z-10 !h-[400px] md:!w-[880px] md:!h-[440px] lg:!w-[920px] lg:!h-[460px] left-4 md:left-1/2 md:-translate-x-1/2"
        source={{
          desktop: {
            height: 460,
            src: HyperliquidMockDesktop,
          },
          mobile: {
            height: 400,
            src: HyperliquidMockMobile,
          },
          tablet: {
            height: 440,
            src: HyperliquidMockTablet,
          },
        }}
      />
    </figure>
  );
};
