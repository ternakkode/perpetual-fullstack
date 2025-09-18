import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@brother-terminal/components/ui/drawer";
import { XClose } from "@untitled-ui/icons-react";
import { TradePanel } from "./trade-panel";
import { MarketInformationCard } from "../market-information";
import { formatPrice } from "../../../../utils/price-utils";
import { useState } from "react";
import { IMarketData, PositionType } from "../../../../interfaces/trading";

export const MarketOrderDrawer = ({
  children,
  marketInformation,
  position,
}: {
  children: React.ReactNode;
  marketInformation: IMarketData;
  position: PositionType | "trade";
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="relative">
            <DrawerTitle className="text-center capitalize">
              {position === "trade" ? "Trade" : position}
            </DrawerTitle>
            <DrawerDescription className="sr-only" />
            <DrawerClose
              asChild
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <button aria-label="Close Drawer">
                <XClose className="size-5 text-white-48" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="flex-1 px-4 pb-10 overflow-y-auto">
          <MarketInformation {...marketInformation} />
          <div className="mt-4">
            <TradePanel 
              symbol="ETH"
              price={marketInformation.price}
              connected={false}
              balanceUSD={5249.32}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const MarketInformation = ({ change, netFunding, price }: IMarketData) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="flex-1 px-3 py-2 rounded-lg bg-white-4">
        <MarketInformationCard
          className="text-md"
          label="Mark"
          value={formatPrice(price)}
        />
      </div>
      <div className="flex-1 px-3 py-2 rounded-lg bg-white-4">
        <MarketInformationCard
          className="text-md"
          highlight
          label="24h Change"
          value={change > 0 ? `+${change}%` : `${change}%`}
        />
      </div>
      <div className="flex-1 px-3 py-2 rounded-lg bg-white-4">
        <MarketInformationCard
          className="text-md"
          highlight
          label="Funding"
          tooltip={`Annualized: ${netFunding * 12}%`}
          value={`${netFunding}%`}
        />
      </div>
    </div>
  );
};
