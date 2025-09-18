import { cn } from "@brother-terminal/lib/utils";

import TokenIcon from "./token-icon";

type TokenProps = {
  pairs: string[];
  separator?: string;
  size?: string;
  hideText?: boolean;
};

export const Token: React.FC<
  React.HTMLAttributes<HTMLParagraphElement> & TokenProps
> = ({ pairs, separator = "", size, hideText, ...props }) => {
  return (
    <div className={cn("flex items-center", hideText ? "" : "gap-2")}>
      <div className="flex items-center -space-x-1.5">
        {pairs.map((pair) => (
          <TokenIcon
            key={pair}
            className={cn("!size-4", size)}
            symbol={pair.toLowerCase()}
          />
        ))}
      </div>
      {!hideText && <p className={props.className}>{pairs.join(separator).toUpperCase()}</p>}
    </div>
  );
};
